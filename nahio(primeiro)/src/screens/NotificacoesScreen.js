import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    SafeAreaView,
    RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Assumindo que você tem acesso aos seus estilos globais e cores
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

// Dados de exemplo (simulação de notificações reais)
const mockNotifications = [
    { id: '1', type: 'convite', title: 'Novo Convite de Avaliação', subtitle: 'Você recebeu um convite da Academia Esportiva X.', date: '2 horas atrás', read: false },
    { id: '2', type: 'agendamento', title: 'Agendamento Confirmado', subtitle: 'Seu agendamento para o dia 20/11 foi confirmado.', date: 'Ontem', read: false },
    { id: '3', type: 'sistema', title: 'Atualização de Perfil', subtitle: 'Seu perfil foi atualizado com sucesso.', date: '1 semana atrás', read: true },
    { id: '4', type: 'convite', title: 'Convite Rejeitado', subtitle: 'A Escola de Futebol Y rejeitou seu convite.', date: '2 semanas atrás', read: true },
];

// Função auxiliar para determinar o ícone com base no tipo
const getIcon = (type) => {
    switch (type) {
        case 'convite':
            return '✉️';
        case 'agendamento':
            return '📅';
        case 'sistema':
            return '⚙️';
        default:
            return '💬';
    }
};

const NotificacoesScreen = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    // Lógica para simular a marcação de uma notificação como lida
    const handleNotificationPress = (id, type) => {
        // Marca como lida
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        
        // Ação de navegação (Ex: navegar para a tela de Convites ou Agendamentos)
        if (type === 'convite') {
             // Redireciona para a tela de Convites, se existir no Drawer
             navigation.navigate('Convites');
        } else if (type === 'agendamento') {
             // Redireciona para a tela de Agendamentos, se existir no Drawer
             navigation.navigate('Agendamentos');
        }
    };
    
    // Simulação de Recarregar
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            // Em uma aplicação real, aqui você faria a chamada à API
            setRefreshing(false);
        }, 1500);
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationItem, item.read ? styles.readItem : styles.unreadItem]}
            onPress={() => handleNotificationPress(item.id, item.type)}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getIcon(item.type)}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
            <Text style={styles.headerTitle}>Notificações</Text>
            
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma notificação por enquanto.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        borderRadius: 12,
        backgroundColor: colors.backgroundCard,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    unreadItem: {
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    readItem: {
        borderLeftWidth: 4,
        borderLeftColor: colors.inputBorder,
        opacity: 0.7,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 18,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    date: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
});

export default NotificacoesScreen;