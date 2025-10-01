import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView, // Usamos o SafeAreaView padrão do react-native
} from 'react-native';

// --- Dependências Mockadas para um único ficheiro ---
// Mapeamento de cores baseado no design original e Tailwind
const colors = {
    primary: '#4F46E5',         // Indigo-600
    background: '#F9FAFB',      // Gray-50
    backgroundCard: '#FFFFFF',
    backgroundSecondary: '#EEF2FF', // Indigo-50
    textPrimary: '#1F2937',     // Gray-800
    textSecondary: '#6B7280',     // Gray-500
    inputBorder: '#D1D5DB',     // Gray-300
    white: '#FFFFFF',
};

// Estilos Globais Mockados
const globalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
// ----------------------------------------------------

const CreateAccountScreen = ({ navigation }) => {
    // A simulação de navegação é necessária, pois não temos o objeto 'navigation' real
    const [selectedType, setSelectedType] = useState(null);
    const [statusMessage, setStatusMessage] = useState('Selecione uma opção para continuar.');

    const handleContinue = () => {
        if (!selectedType) {
            setStatusMessage('Por favor, selecione um tipo de conta antes de continuar.');
            return;
        }

        // Simulação de navegação do React Native
        let destination = '';
        switch (selectedType) {
            case 'olheiro':
                destination = 'Registro Olheiro';
                break;
            case 'instituicao':
                destination = 'RegisterInstituicao';
                break;
            default:
                break;
        }

        // Em um projeto real Expo: navigation.navigate(destination);
        setStatusMessage(`Vamos começar seu ${destination}`);
    };

    const handleLogin = () => {
         navigation.navigate('LoginScreen');
        setStatusMessage('A navegar para a tela de Login (Simulação)...');
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={styles.container}>
                {/* Título e Status */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Escolha seu perfil</Text>
                    <Text style={styles.subtitle}>
                        Selecione o tipo de conta que melhor se adequa às suas necessidades
                    </Text>
                    <Text style={[styles.statusText, { color: selectedType ? colors.primary : colors.textSecondary }]}>
                        {statusMessage}
                    </Text>
                </View>

                {/* Opções de perfil */}
                <View style={styles.optionsContainer}>
                    
                    {/* Opção Olheiro */}
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedType === 'olheiro' && styles.optionCardSelected
                        ]}
                        onPress={() => setSelectedType('olheiro')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.optionIcon}>
                            <View style={styles.iconCircle}>
                                {/* Substituí o emoji por um ícone para consistência visual */}
                                <Text style={styles.iconText}>🔍</Text>
                            </View>
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Olheiro</Text>
                            <Text style={styles.optionDescription}>
                                Descubra novos talentos
                            </Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <View style={[
                                styles.radio,
                                selectedType === 'olheiro' && styles.radioSelected
                            ]}>
                                {selectedType === 'olheiro' && <View style={styles.radioDot} />}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Opção Instituição */}
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedType === 'instituicao' && styles.optionCardSelected
                        ]}
                        onPress={() => setSelectedType('instituicao')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.optionIcon}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.iconText}>🏫</Text>
                            </View>
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Instituição</Text>
                            <Text style={styles.optionDescription}>
                                Gerencie sua instituição
                            </Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <View style={[
                                styles.radio,
                                selectedType === 'instituicao' && styles.radioSelected
                            ]}>
                                {selectedType === 'instituicao' && <View style={styles.radioDot} />}
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

                {/* Botões */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedType && styles.continueButtonDisabled
                        ]}
                        onPress={handleContinue}
                        disabled={!selectedType}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.continueButtonText}>Continuar</Text>
                    </TouchableOpacity>

                    {/* Link para login */}
                    <TouchableOpacity 
                        style={styles.loginContainer}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginText}>
                            Já tem conta? <Text style={styles.loginLink}>Entrar</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 10,
        // Adicionando sombra leve
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    statusText: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: '600',
    },
    optionsContainer: {
        flex: 1,
        justifyContent: 'center',
        // Adicionando um pequeno espaçamento inferior para mobile
        marginBottom: 20, 
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: 15,
        padding: 20,
        marginVertical: 8, // Diminuído o margin vertical para 8
        borderWidth: 2,
        borderColor: 'transparent',
        // Sombra elegante para React Native
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5.46,
        elevation: 8,
    },
    optionCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.backgroundSecondary,
        shadowColor: colors.primary, // Sombra mais proeminente no selecionado
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 7.46,
        elevation: 10,
    },
    optionIcon: {
        marginRight: 15,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 24,
        color: colors.white, // O emoji/ícone deve ser branco
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '700', // FontWeight 'bold' é 700 no RN
        color: colors.textPrimary,
        marginBottom: 5,
    },
    optionDescription: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    radioContainer: {
        marginLeft: 15,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.inputBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.backgroundCard, // Fundo branco dentro do círculo
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    buttonContainer: {
        marginTop: 20, // Ajustado para ser menos espaçado
    },
    continueButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16, // Ligeiramente menor para um visual mais moderno
        borderRadius: 10, // Menos arredondado
        alignItems: 'center',
        marginBottom: 20,
        // Sombra do botão
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    continueButtonDisabled: {
        backgroundColor: '#9CA3AF', // Gray-400
        shadowOpacity: 0.1,
        elevation: 2,
    },
    continueButtonText: {
        color: colors.white, // Mudado para branco para melhor contraste
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        alignItems: 'center',
        paddingBottom: 10, // Adiciona padding inferior
    },
    loginText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default CreateAccountScreen;