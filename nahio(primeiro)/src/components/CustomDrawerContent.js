import React from 'react';
import {
 View,
 Text,
 TouchableOpacity,
 StyleSheet,
 Image,
 Alert,
} from 'react-native';
import {
 DrawerContentScrollView,
 DrawerItemList,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';

const CustomDrawerContent = (props) => {
 const { userData, logout } = useAuth();

 const handleLogout = () => {
   Alert.alert(
     'Sair',
     'Tem certeza que deseja sair da sua conta?',
     [
       {
         text: 'Cancelar',
         style: 'cancel',
       },
       {
         text: 'Sair',
         style: 'destructive',
         onPress: async () => {
           const result = await logout();
           if (!result.success) {
             Alert.alert('Erro', 'Erro ao fazer logout');
           }
         },
       },
     ]
   );
 };

 const getUserTypeLabel = (userType) => {
   switch (userType) {
     case 'olheiro':
       return 'Olheiro';
     case 'instituicao':
       return 'Instituição';
     case 'responsavel':
       return 'Responsável';
     default:
       return 'Usuário';
   }
 };

 const getUserName = () => {
   if (userData?.profile?.nome) {
     return userData.profile.nome;
   }
   if (userData?.profile?.nomeEscola) {
     return userData.profile.nomeEscola;
   }
   return userData?.email || 'Usuário';
 };

 return (
   <SafeAreaView style={styles.container}>
     {/* Header do Drawer */}
     <View style={styles.header}>
       {/* Logo */}
       <View style={styles.logoContainer}>
         <View style={styles.logoWrapper}>
           <View style={styles.ball}>
             <View style={styles.ballInner}>
               <View style={[styles.hexagon, styles.hexagon1]} />
               <View style={[styles.hexagon, styles.hexagon2]} />
               <View style={[styles.hexagon, styles.hexagon3]} />
               <View style={[styles.hexagon, styles.hexagon4]} />
               <View style={[styles.hexagon, styles.hexagon5]} />
             </View>
           </View>
           <View style={styles.flame} />
         </View>
       </View>
       {/* Informações do usuário */}
       <View style={styles.userInfo}>
         {/* Avatar do usuário */}
         <View style={styles.avatarContainer}>
           {userData?.profile?.profileImage ? (
             <Image 
               source={{ uri: userData.profile.profileImage }} 
               style={styles.avatar}
             />
           ) : (
             <View style={styles.avatarPlaceholder}>
               <Text style={styles.avatarText}>
                 {getUserName().charAt(0).toUpperCase()}
               </Text>
             </View>
           )}
         </View>
         {/* Nome e tipo do usuário */}
         <View style={styles.userDetails}>
           <Text style={styles.userName} numberOfLines={1}>
             {getUserName()}
           </Text>
           <Text style={styles.userType}>
             {getUserTypeLabel(userData?.userType)}
           </Text>
         </View>
       </View>
       {/* Linha divisória */}
       <View style={styles.divider} />
     </View>
     {/* Lista de itens do drawer */}
     <DrawerContentScrollView 
       {...props} 
       contentContainerStyle={styles.drawerContent}
       showsVerticalScrollIndicator={false}
     >
       <DrawerItemList {...props} />
     </DrawerContentScrollView>
     {/* Footer com botão de logout */}
     <View style={styles.footer}>
       <View style={styles.divider} />
       <TouchableOpacity 
         style={styles.logoutButton}
         onPress={handleLogout}
       >
         <Text style={styles.logoutIcon}>🚪</Text>
         <Text style={styles.logoutText}>Sair</Text>
       </TouchableOpacity>
       {/* Versão do app */}
       <Text style={styles.versionText}>Nahio v1.0.0</Text>
     </View>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
 },
 header: {
   paddingHorizontal: 20,
   paddingVertical: 30,
 },
 logoContainer: {
   alignItems: 'center',
   marginBottom: 20,
 },
 logoWrapper: {
   position: 'relative',
   width: 60,
   height: 60,
 },
 ball: {
   width: 60,
   height: 60,
   borderRadius: 30,
   backgroundColor: colors.primary,
   justifyContent: 'center',
   alignItems: 'center',
 },
 ballInner: {
   width: 50,
   height: 50,
   borderRadius: 25,
   position: 'relative',
 },
 hexagon: {
   position: 'absolute',
   width: 8,
   height: 8,
   backgroundColor: colors.background,
   borderRadius: 4,
 },
 hexagon1: { top: 8, left: 21 },
 hexagon2: { top: 21, left: 10 },
 hexagon3: { top: 21, right: 10 },
 hexagon4: { bottom: 21, left: 15 },
 hexagon5: { bottom: 8, right: 21 },
 flame: {
   position: 'absolute',
   right: -10,
   top: 10,
   width: 20,
   height: 40,
   backgroundColor: colors.primary,
   borderTopRightRadius: 10,
   borderBottomRightRadius: 10,
   opacity: 0.8,
   transform: [{ skewY: '-15deg' }],
 },
 userInfo: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 avatarContainer: {
   marginRight: 15,
 },
 avatar: {
   width: 50,
   height: 50,
   borderRadius: 25,
 },
 avatarPlaceholder: {
   width: 50,
   height: 50,
   borderRadius: 25,
   backgroundColor: colors.primary,
   justifyContent: 'center',
   alignItems: 'center',
 },
 avatarText: {
   color: colors.textPrimary,
   fontSize: 20,
   fontWeight: 'bold',
 },
 userDetails: {
   flex: 1,
 },
 userName: {
   color: colors.textPrimary,
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 2,
 },
 userType: {
   color: colors.textSecondary,
   fontSize: 14,
 },
 divider: {
   height: 1,
    backgroundColor: colors.inputBorder,
    marginTop: 20,
 },
 drawerContent: {
    paddingTop: 10,
 },
 footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
 },
 logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
 },
 logoutIcon: {
    fontSize: 20,
    marginRight: 15,
 },
 logoutText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
 },
 versionText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
 },
});

export default CustomDrawerContent;