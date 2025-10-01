import React, { useState, useEffect } from 'react';
import {
 View,
 Text,
 TouchableOpacity,
 StyleSheet,
 ScrollView,
 Image,
 FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
const HomeOlheiroScreen = ({ navigation }) => {
 const { userData } = useAuth();
 const [recentAtletas, setRecentAtletas] = useState([]);
 const [notifications, setNotifications] = useState([]);
 useEffect(() => {
   // Carregar dados iniciais
   loadRecentAtletas();
   loadNotifications();
 }, []);
 const loadRecentAtletas = () => {
   // Mock data - em um app real, isso viria do Firebase
   const mockAtletas = [
     {
       id: '1',
       nome: 'João Silva',
       idade: 17,
       posicao: 'Atacante',
       instituicao: 'Arena Belletti Itapeva',
       profileImage: null,
       rating: 4.5,
     },
     {
       id: '2',
       nome: 'Pedro Santos',
       idade: 16,
       posicao: 'Meio-campo',
       instituicao: 'Arena Belletti Itapeva',
       profileImage: null,
       rating: 4.2,
     },
     {
       id: '3',
       nome: 'Lucas Oliveira',
       idade: 18,
       posicao: 'Zagueiro',
       instituicao: 'Arena Belletti Itapeva',
       profileImage: null,
       rating: 4.0,
     },
   ];
   setRecentAtletas(mockAtletas);
 };
 const loadNotifications = () => {
   // Mock data
   const mockNotifications = [
     {
       id: '1',
       titulo: 'Novo atleta disponível',
       mensagem: 'João Silva foi adicionado pela Arena Belletti',
       tipo: 'atleta',
       isRead: false,
       createdAt: new Date(),
     },
     {
       id: '2',
       titulo: 'Agendamento confirmado',
       mensagem: 'Sua visita foi confirmada para amanhã às 14h',
       tipo: 'agendamento',
       isRead: false,
       createdAt: new Date(),
     },
   ];
   setNotifications(mockNotifications);
 };
 const openDrawer = () => {
   navigation.openDrawer();
 };
 const renderAtletaCard = ({ item }) => (
   <TouchableOpacity 
     style={styles.atletaCard}
     onPress={() => navigation.navigate('AtletaDetail', { atletaId: item.id 
})}
   >
     <View style={styles.atletaImageContainer}>
       {item.profileImage ? (
         <Image source={{ uri: item.profileImage }} style={styles.atletaImage} 
/>
       ) : (
         <View style={styles.atletaImagePlaceholder}>
           <Text style={styles.atletaImageText}>
             {item.nome.charAt(0)}
           </Text>
         </View>
       )}
     </View>
     <View style={styles.atletaInfo}>
       <Text style={styles.atletaNome} numberOfLines={1}>
         {item.nome}
       </Text>
       <Text style={styles.atletaDetalhes}>
         {item.idade} anos • {item.posicao}
       </Text>
       <Text style={styles.atletaInstituicao} numberOfLines={1}>
         {item.instituicao}
       </Text>
       {/* Rating */}
       <View style={styles.ratingContainer}>
         <Text style={styles.ratingText}>
⭐
{item.rating}</Text>
       </View>
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
     <ScrollView style={styles.container} showsVerticalScrollIndicator=
{false}>
       {/* Header */}
       <View style={styles.header}>
         <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
           <View style={styles.menuLine} />
           <View style={styles.menuLine} />
           <View style={styles.menuLine} />
         </TouchableOpacity>
         <View style={styles.headerContent}>
           <Text style={styles.greeting}>Olá, {userData?.profile?.nome || 
'Olheiro'}!</Text>
           <Text style={styles.subtitle}>Descubra novos talentos</Text>
         </View>
         <TouchableOpacity 
           style={styles.notificationButton}
           onPress={() => navigation.navigate('Notificacoes')}
         >
           <Text style={styles.notificationIcon}>
🔔
</Text>
           {notifications.filter(n => !n.isRead).length > 0 && (
             <View style={styles.notificationBadge}>
               <Text style={styles.notificationBadgeText}>
                 {notifications.filter(n => !n.isRead).length}
               </Text>
             </View>
           )}
         </TouchableOpacity>
       </View>
       {/* Stats Cards */}
       <View style={styles.statsContainer}>
         <View style={styles.statsRow}>
           <TouchableOpacity style={styles.statCard}>
             <Text style={styles.statNumber}>127</Text>
             <Text style={styles.statLabel}>Atletas</Text>
             <Text style={styles.statSubLabel}>Visualizados</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.statCard}>
             <Text style={styles.statNumber}>8</Text>
             <Text style={styles.statLabel}>Visitas</Text>
             <Text style={styles.statSubLabel}>Agendadas</Text>
           </TouchableOpacity>
         </View>
         <View style={styles.statsRow}>
           <TouchableOpacity style={styles.statCard}>
             <Text style={styles.statNumber}>15</Text>
             <Text style={styles.statLabel}>Convites</Text>
             <Text style={styles.statSubLabel}>Recebidos</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.statCard}>
             <Text style={styles.statNumber}>3</Text>
             <Text style={styles.statLabel}>Favoritos</Text>
             <Text style={styles.statSubLabel}>Salvos</Text>
           </TouchableOpacity>
         </View>
       </View>
       {/* Atletas Recentes */}
       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Atletas Recentes</Text>
           <TouchableOpacity onPress={() => navigation.navigate('Atletas')}>
             <Text style={styles.sectionLink}>Ver todos</Text>
           </TouchableOpacity>
         </View>
         <FlatList
           data={recentAtletas}
           renderItem={renderAtletaCard}
           keyExtractor={(item) => item.id}
           horizontal
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.atletasList}
         />
       </View>
       {/* Ações Rápidas */}
       <View style={styles.section}>
         <Text style={styles.sectionTitle}>Ações Rápidas</Text>
         <View style={styles.quickActionsContainer}>
           <TouchableOpacity 
             style={styles.quickActionCard}
             onPress={() => navigation.navigate('Atletas')}
           >
             <Text style={styles.quickActionIcon}>
🔍
</Text>
             <Text style={styles.quickActionTitle}>Buscar Atletas</Text>
             <Text style={styles.quickActionSubtitle}>Encontre novos 
talentos</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={styles.quickActionCard}
             onPress={() => navigation.navigate('Agendamentos')}
           >
             <Text style={styles.quickActionIcon}>
📅
</Text>
             <Text style={styles.quickActionTitle}>Agendar Visita</Text>
             <Text style={styles.quickActionSubtitle}>Visite uma 
instituição</Text>
           </TouchableOpacity>
         </View>
       </View>
       {/* Notificações Recentes */}
       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Notificações</Text>
           <TouchableOpacity onPress={() => 
navigation.navigate('Notificacoes')}>
             <Text style={styles.sectionLink}>Ver todas</Text>
           </TouchableOpacity>
         </View>
         <FlatList
           data={notifications.slice(0, 3)}
           renderItem={renderNotificationItem}
           keyExtractor={(item) => item.id}
           scrollEnabled={false}
         />
       </View>
     </ScrollView>
   </SafeAreaView>
 );
};
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 20,
   paddingVertical: 20,
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
   fontSize: 20,
   fontWeight: 'bold',
   color: colors.textPrimary,
 },
 subtitle: {
   fontSize: 14,
   color: colors.textSecondary,
   marginTop: 2,
 },
 notificationButton: {
   position: 'relative',
   padding: 5,
 },
 notificationIcon: {
   fontSize: 24,
 },
 notificationBadge: {
   position: 'absolute',
   top: 0,
   right: 0,
   backgroundColor: colors.primary,
   borderRadius: 10,
   minWidth: 20,
   height: 20,
   justifyContent: 'center',
   alignItems: 'center',
 },
 notificationBadgeText: {
   color: colors.textPrimary,
   fontSize: 12,
   fontWeight: 'bold',
 },
 statsContainer: {
   paddingHorizontal: 20,
   marginBottom: 30,
 },
 statsRow: {
   flexDirection: 'row',
   marginBottom: 15,
 },
 statCard: {
   flex: 1,
   backgroundColor: colors.backgroundCard,
   borderRadius: 15,
   padding: 20,
   marginHorizontal: 5,
   alignItems: 'center',
 },
 statNumber: {
   fontSize: 24,
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
 atletasList: {
   paddingLeft: 20,
 },
 atletaCard: {
   backgroundColor: colors.backgroundCard,
   borderRadius: 15,
   padding: 15,
   marginRight: 15,
   width: 160,
 },
 atletaImageContainer: {
   alignItems: 'center',
   marginBottom: 10,
 },
 atletaImage: {
   width: 60,
   height: 60,
   borderRadius: 30,
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
   color: colors.textPrimary,
   fontSize: 20,
   fontWeight: 'bold',
 },
 atletaInfo: {
   alignItems: 'center',
 },
 atletaNome: {
   fontSize: 14,
   fontWeight: 'bold',
   color: colors.textPrimary,
   marginBottom: 4,
   textAlign: 'center',
 },
 atletaDetalhes: {
   fontSize: 12,
   color: colors.textSecondary,
   marginBottom: 4,
 },
 atletaInstituicao: {
   fontSize: 11,
   color: colors.textMuted,
   marginBottom: 8,
   textAlign: 'center',
 },
 ratingContainer: {
   backgroundColor: colors.backgroundSecondary,
   paddingHorizontal: 8,
   paddingVertical: 4,
   borderRadius: 10,
 },
 ratingText: {
   fontSize: 12,
   color: colors.textPrimary,
 },
 quickActionsContainer: {
   flexDirection: 'row',
   paddingHorizontal: 20,
 },
 quickActionCard: {
   flex: 1,
   backgroundColor: colors.backgroundCard,
   borderRadius: 15,
   padding: 20,
   marginHorizontal: 5,
   alignItems: 'center',
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
 notificationItem: {
   flexDirection: 'row',
   alignItems: 'flex-start',
   backgroundColor: colors.backgroundCard,
   borderRadius: 12,
   padding: 15,
   marginHorizontal: 20,
   marginBottom: 10,
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
backgroundColor: colors.primary,
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
export default HomeOlheiroScreen;