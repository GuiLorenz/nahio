import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    // collection, addDoc - Mantidos apenas se usados, mas não são estritamente necessários aqui
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; // Assumindo paths corretos
import { COLLECTIONS, USER_TYPES } from './firebaseStructure'; // Assumindo paths corretos

/**
 * Serviço para gerenciar todas as operações de Autenticação e Perfil do Usuário
 * no Firebase Auth e Firestore.
 */
class AuthService {

    /**
     * Auxiliar privado para padronizar o tratamento de erros.
     * @param {string} operation Nome da operação que falhou.
     * @param {Error} error Objeto de erro.
     * @returns {{ success: false, error: string }} Objeto de resultado padronizado.
     */
    _handleError(operation, error) {
        console.error(`Erro ao ${operation}:`, error);
        return { success: false, error: error.message };
    }

    /**
     * Auxiliar privado para determinar o nome da coleção de perfil.
     * @param {string} userType Tipo de usuário (USER_TYPES).
     * @returns {string | null} Nome da coleção ou null se inválido/não mapeado.
     */
    _getProfileCollectionName(userType) {
        switch (userType) {
            case USER_TYPES.OLHEIRO:
                return COLLECTIONS.OLHEIROS;
            case USER_TYPES.INSTITUICAO:
                return COLLECTIONS.INSTITUICOES;
            case USER_TYPES.RESPONSAVEL:
                return COLLECTIONS.RESPONSAVEIS;
            default:
                return null;
        }
    }

    /**
     * Auxiliar privado para salvar o documento base na coleção 'users'.
     * @param {string} uid ID do usuário.
     * @param {string} email Email do usuário.
     * @param {string} userType Tipo de usuário.
     * @returns {Promise<void>}
     */
    async _saveBaseUserDoc(uid, email, userType) {
        const userDocRef = doc(db, COLLECTIONS.USERS, uid);
        await setDoc(userDocRef, {
            email: email,
            userType: userType,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true
        });
    }

    // --- Autenticação ---

    /**
     * Registra um novo usuário (olheiro ou instituição) no Auth e cria documentos no Firestore.
     * @param {string} email Email do usuário.
     * @param {string} password Senha.
     * @param {object} userData Dados específicos do perfil (nome, cnpj, etc.).
     * @param {string} userType Tipo de usuário (OLHEIRO ou INSTITUICAO).
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async registerUser(email, password, userData, userType) {
        try {
            const collectionName = this._getProfileCollectionName(userType);
            if (!collectionName || userType === USER_TYPES.RESPONSAVEL) {
                throw new Error('Tipo de usuário inválido para registro direto.');
            }

            // 1. Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Criar documento base na coleção 'users'
            await this._saveBaseUserDoc(user.uid, email, userType);

            // 3. Criar documento específico do perfil (olheiros/instituicoes)
            await setDoc(doc(db, collectionName, user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return { success: true, user };
        } catch (error) {
            return this._handleError('registrar usuário', error);
        }
    }

    /**
     * Realiza o login do usuário.
     * @param {string} email Email do usuário.
     * @param {string} password Senha.
     * @returns {Promise<{success: boolean, user?: object, userData?: object, error?: string}>}
     */
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Buscar dados do usuário na coleção 'users'
            const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
            if (!userDoc.exists()) {
                throw new Error('Dados do usuário não encontrados no Firestore. Por favor, contate o suporte.');
            }

            return { success: true, user, userData: userDoc.data() };
        } catch (error) {
            return this._handleError('fazer login', error);
        }
    }

    /**
     * Realiza o logout do usuário.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return this._handleError('fazer logout', error);
        }
    }

    /**
     * Envia um email de redefinição de senha para o email fornecido.
     * @param {string} email Email do usuário.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return this._handleError('enviar email de recuperação de senha', error);
        }
    }

    /**
     * Observa mudanças no estado de autenticação (wrapper para onAuthStateChanged).
     * @param {(user: import('firebase/auth').User | null) => void} callback Função a ser executada na mudança de estado.
     * @returns {() => void} Função para desinscrever o listener.
     */
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    }

  

  

    /**
     * Obtém os dados base e os dados de perfil específicos do usuário (Ex: Olheiro, Instituição).
     * @param {string} uid ID do usuário.
     * @returns {Promise<{success: boolean, userData?: object, error?: string}>}
     */
    async getUserData(uid) {
        try {
            const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
            if (!userDoc.exists()) {
                return { success: false, error: 'Usuário não encontrado' };
            }
            
            const userData = userDoc.data();
            const userType = userData.userType;
            let profileData = null;

            const collectionName = this._getProfileCollectionName(userType);

            if (collectionName) {
                const profileDoc = await getDoc(doc(db, collectionName, uid));
                if (profileDoc.exists()) {
                    profileData = profileDoc.data();
                }
            }

            return {
                success: true,
                userData: { ...userData, profile: profileData }
            };
        } catch (error) {
            return this._handleError('buscar dados do usuário', error);
        }
    }

    /**
     * Cria um usuário do tipo RESPONSÁVEL para uma instituição.
     * O usuário é criado no Auth e é enviado um e-mail de redefinição de senha (método mais seguro).
     * @param {string} instituicaoId ID da instituição.
     * @param {string} responsavelEmail Email do responsável.
     * @param {string} responsavelNome Nome do responsável.
     * @param {string} senhaProvisoria Senha temporária para criação inicial no Auth.
     * @returns {Promise<{success: boolean, responsavelId?: string, error?: string}>}
     */
    async createResponsavel(instituicaoId, responsavelEmail, responsavelNome, senhaProvisoria) {
        try {
            // 1. Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                responsavelEmail,
                senhaProvisoria
            );
            const user = userCredential.user;

            // 2. Criar documento base na coleção 'users'
            await this._saveBaseUserDoc(user.uid, responsavelEmail, USER_TYPES.RESPONSAVEL);

            // 3. Criar documento específico do responsável
            await setDoc(doc(db, COLLECTIONS.RESPONSAVEIS, user.uid), {
                nome: responsavelNome,
                instituicaoId: instituicaoId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // 4. Enviar e-mail de redefinição para forçar o usuário a definir uma senha segura
            await sendPasswordResetEmail(auth, responsavelEmail);
            
            return { success: true, responsavelId: user.uid };
        } catch (error) {
            return this._handleError('criar responsável', error);
        }
    }

    /**
     * Atualiza os dados de perfil do usuário na coleção específica (olheiros, instituicoes, responsaveis).
     * @param {string} uid ID do usuário.
     * @param {string} userType Tipo de usuário (USER_TYPES).
     * @param {object} updatedData Dados a serem atualizados no perfil.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async updateProfile(uid, userType, updatedData) {
        try {
            const collectionName = this._getProfileCollectionName(userType);
            
            if (!collectionName) {
                throw new Error('Tipo de usuário inválido para atualização de perfil');
            }
            
            await setDoc(doc(db, collectionName, uid), {
                ...updatedData,
                updatedAt: serverTimestamp()
            }, { merge: true }); // Usar merge para atualizar campos sem sobrescrever o documento inteiro
            
            return { success: true };
        } catch (error) {
            return this._handleError('atualizar perfil', error);
        }
    }
}

export default new AuthService();