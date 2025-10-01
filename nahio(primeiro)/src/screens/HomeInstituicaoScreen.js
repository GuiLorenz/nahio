import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    FlatList,
    ActivityIndicator, // Importado para usar no loading
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext'; // Assumindo este path
import { colors } from '../styles/colors'; // Assumindo este path
import { globalStyles } from '../styles/globalStyles'; // Assumindo este path
import AtletaService from '../services/atletaService'; // Assumindo este path

// --- DADOS MOCK PARA PREENCHER O CARD DE ATLETAS (Ajustado) ---
const MOCK_ATLETA = {
    id: 'mock-1',
    nome: 'Atleta Exemplo',
    profileImage: null,
    idade: 17,
    posicao: 'Meio-Campo',
    instituicaoNome: 'Sua Instituição',
};
// ----------------------------------------------------------------

const HomeInstituicaoScreen = ({ navigation }) => {
    const { userData } = useAuth();
    const [meusAtletas, setMeusAtletas] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loadingAtletas, setLoadingAtletas] = useState(true);

    // --- Lógica de Carregamento de Dados ---

    // 1. Carregar Atletas
    const loadMeusAtletas = useCallback(async (instituicaoId) => {
        setLoadingAtletas(true);
        // Usando o MOCK_ATLETA como fallback em caso de erro no serviço
        if (!instituicaoId) {
             setMeusAtletas([MOCK_ATLETA]);
             setLoadingAtletas(false);
             return;
        }

        const result = await AtletaService.getAtletasByInstituicao(instituicaoId);
        
        if (result.success) {
            // Garante que o array de atletas sempre tenha a estrutura correta
            setMeusAtletas(result.atletas || []); 
        } else {
            console.error('Erro ao carregar atletas:', result.error);
            // Poderia adicionar um estado de erro aqui
        }
        setLoadingAtletas(false);
    }, []);

    // 2. Carregar Notificações
    const loadNotifications = useCallback(() => {
        // Mock data - em um app real, isso viria do Firebase/Backend
        const mockNotifications = [
            {
                id: '1',
                titulo: 'Novo agendamento de visita',
                mensagem: 'Olheiro João Silva agendou uma visita para 15/10 às 10h',
                tipo: 'agendamento',
                isRead: false,
                createdAt: new Date(),
            },
            {
                id: '2',
                titulo: 'Convite aceito',
                mensagem: 'Olheiro Pedro Santos aceitou seu convite para o atleta Lucas Oliveira',
                tipo: 'convite',
                isRead: true,
                createdAt: new Date(),
            },
            {
                id: '3',
                titulo: 'Pagamento pendente',
                mensagem: 'Sua mensalidade está pendente. Regularize para evitar interrupções.',
                tipo: 'alerta',
                isRead: false,
                createdAt: new Date(),
            },
        ];
        setNotifications(mockNotifications);
    }, []);

    useEffect(() => {
        if (userData?.uid) {
            loadMeusAtletas(userData.uid);
            loadNotifications();
        }
    }, [userData, loadMeusAtletas, loadNotifications]);

    const openDrawer = () => {
        navigation.openDrawer();
    };

    // --- Componente de Renderização dos Cards ---

    const renderAtletaCard = ({ item }) => (
        <TouchableOpacity 
            style={styles.atletaCard}
            onPress={() => navigation.navigate('AtletaDetail', { atletaId: item.id })}
        >
            <View style={styles.atletaImageContainer}>
                {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} style={styles.atletaImage} />
                ) : (
                    <View style={styles.atletaImagePlaceholder}>
                        <Text style={styles.atletaImageText}>
                            {item.nome.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.atletaInfo}>
                <Text style={styles.atletaNome} numberOfLines={1}>
                    {item.nome}
                </Text>
                <Text style={styles.atletaDetalhes}>
                    {item.idade || '--'} anos • {item.posicao || 'Posição'}
                </Text>
                <Text style={styles.atletaInstituicao} numberOfLines={1}>
                    {item.instituicaoNome || 'Instituição'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationItem}>
            <View style={[
                styles.notificationDot,
                !item.isRead && styles.notificationDotUnread
            ]} />
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.titulo}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                    {item.mensagem}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                        <View style={styles.menuLine} />
                        <View style={styles.menuLine} />
                        <View style={styles.menuLine} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.greeting} numberOfLines={1}>
                            Olá, {userData?.profile?.nome || userData?.profile?.nomeEscola || 'Instituição'}!
                        </Text>
                        <Text style={styles.subtitle}>Gerencie seus atletas e agendamentos</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('Notificacoes')}
                    >
                        <Text style={styles.notificationIcon}>🔔</Text>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>
                                    {notifications.filter(n => !n.isRead).length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* --- Estatísticas (Stats Cards) --- */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Atletas')}>
                            <Text style={styles.statNumber}>{meusAtletas.length}</Text>
                            <Text style={styles.statLabel}>Atletas</Text>
                            <Text style={styles.statSubLabel}>Cadastrados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Agendamentos')}>
                            {/* Dados mockados, substituir por dados reais */}
                            <Text style={styles.statNumber}>5</Text> 
                            <Text style={styles.statLabel}>Agendamentos</Text>
                            <Text style={styles.statSubLabel}>Pendentes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsRow}>
                        <TouchableOpacity style={styles.statCard}>
                            <Text style={styles.statNumber}>10</Text>
                            <Text style={styles.statLabel}>Convites</Text>
                            <Text style={styles.statSubLabel}>Enviados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statCard}>
                            <Text style={styles.statNumber}>2</Text>
                            <Text style={styles.statLabel}>Responsáveis</Text>
                            <Text style={styles.statSubLabel}>Ativos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* --- Meus Atletas (Carrossel) --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Meus Atletas</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Atletas')}>
                            <Text style={styles.sectionLink}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    {loadingAtletas ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>Carregando atletas...</Text>
                        </View>
                    ) : meusAtletas.length > 0 ? (
                        <FlatList
                            data={meusAtletas}
                            renderItem={renderAtletaCard}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.atletasList}
                        />
                    ) : (
                        <Text style={styles.emptyStateText}>
                            Nenhum atleta cadastrado ainda. Cadastre um novo talento!
                        </Text>
                    )}
                </View>

                {/* --- Ações Rápidas --- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Ações Rápidas</Text>
                    <View style={styles.quickActionsContainer}>
                        <TouchableOpacity 
                            style={styles.quickActionCard}
                            onPress={() => navigation.navigate('AtletaCreate')} // Assumindo uma tela de criação
                        >
                            <Text style={styles.quickActionIcon}>⚽</Text>
                            <Text style={styles.quickActionTitle}>Cadastrar Atleta</Text>
                            <Text style={styles.quickActionSubtitle}>Adicione um novo talento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.quickActionCard}
                            onPress={() => navigation.navigate('ConviteCreate')} // Assumindo uma tela de convite
                        >
                            <Text style={styles.quickActionIcon}>✉️</Text>
                            <Text style={styles.quickActionTitle}>Enviar Convite</Text>
                            <Text style={styles.quickActionSubtitle}>Convide um olheiro</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- Notificações Recentes --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Notificações Recentes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
                            <Text style={styles.sectionLink}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={notifications.slice(0, 3)} // Mostra apenas as 3 mais recentes
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.notificationsList}
                    />
                </View>
                {/* Espaço de respiro no fim do ScrollView */}
                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15, // Ajustado
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuButton: {
        width: 30,
        height: 30,
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    menuLine: {
        height: 2,
        backgroundColor: colors.textPrimary,
        borderRadius: 1,
    },
    headerContent: {
        flex: 1,
        marginLeft: 20,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    notificationButton: {
        position: 'relative',
        padding: 5,
        marginLeft: 10,
    },
    notificationIcon: {
        fontSize: 24,
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.error, // Cor de destaque para badge
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    notificationBadgeText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsContainer: {
        paddingHorizontal: 15, // Ajustado para centralizar
        paddingTop: 20,
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10, // Espaçamento entre as linhas de cards
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.backgroundCard,
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 5, // Espaçamento entre os cards na linha
        alignItems: 'center',
        shadowColor: colors.shadow, // Adicionado sombra leve
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28, // Aumentado para destaque
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    statSubLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    sectionLink: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
    emptyStateText: {
        color: colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        fontSize: 14,
    },
    atletasList: {
        paddingHorizontal: 20, // Ajustado para ter padding inicial
    },
    atletaCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        width: 140, // Largura ajustada para caber mais na tela
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    atletaImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    atletaImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2, // Adicionado borda para destacar a imagem
        borderColor: colors.primary,
    },
    atletaImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    atletaImageText: {
        color: colors.background, // Corrigido para ser visível
        fontSize: 24, // Aumentado
        fontWeight: 'bold',
    },
    atletaInfo: {
        alignItems: 'center',
        width: '100%',
    },
    atletaNome: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 2,
        textAlign: 'center',
    },
    atletaDetalhes: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    atletaInstituicao: {
        fontSize: 11,
        color: colors.textMuted,
        textAlign: 'center',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    quickActionCard: {
        flex: 1,
        backgroundColor: colors.backgroundCard,
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    quickActionIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    quickActionSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    notificationsList: {
        paddingBottom: 10, 
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.border,
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.textMuted,
        marginTop: 6,
        marginRight: 12,
    },
    notificationDotUnread: {
        backgroundColor: colors.error, // Destaque para não lido
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
});

export default HomeInstituicaoScreen;