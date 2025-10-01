import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text } from 'react-native'; 
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';

// Telas
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import RegisterOlheiroScreen from '../screens/RegisterOlheiroScreen';
import RegisterInstituicaoScreen from '../screens/RegisterInstituicaoScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// Telas iniciais
import HomeOlheiroScreen from '../screens/HomeOlheiroScreen';
import HomeInstituicaoScreen from '../screens/HomeInstituicaoScreen';
import HomeResponsavelScreen from '../screens/HomeResponsavelScreen';
// Telas de perfil
import EditProfileOlheiroScreen from '../screens/EditProfileOlheiroScreen';
import EditProfileInstituicaoScreen from '../screens/EditProfileInstituicaoScreen';
// Outras telas
import AtletasScreen from '../screens/AddAtletaScreen';
import AtletaDetailScreen from '../screens/AtletaDetailScreen';
import AgendamentosScreen from '../screens/AgendamentosScreen';
import ConvitesScreen from '../screens/ConvitesScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen';
// Componentes
import CustomDrawerContent from '../components/CustomDrawerContent';
import LoadingScreen from '../components/LoadingScreen'; // Pode ser usado como alternativa ao SplashScreen

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack de autenticação
const AuthStack = () => (
 <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
   <Stack.Screen name="Login" component={LoginScreen} />
   <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
   <Stack.Screen name="RegisterOlheiro" component={RegisterOlheiroScreen} />
   <Stack.Screen name="RegisterInstituicao" component={RegisterInstituicaoScreen} />
   <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
 </Stack.Navigator>
);

// Drawers
const OlheiroDrawer = () => (
 <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: colors.background, width: 280 }, drawerActiveTintColor: colors.primary, drawerInactiveTintColor: colors.textSecondary }}>
   <Drawer.Screen name="HomeOlheiro" component={HomeOlheiroScreen} options={{ drawerLabel: 'Início', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> 🏠 </Text> }} />
   <Drawer.Screen name="Atletas" component={AtletasScreen} options={{ drawerLabel: 'Atletas', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> ⚽ </Text> }} />
   <Drawer.Screen name="Agendamentos" component={AgendamentosScreen} options={{ drawerLabel: 'Agendamentos', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> 📅 </Text> }} />
   <Drawer.Screen name="Convites" component={ConvitesScreen} options={{ drawerLabel: 'Convites', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> ✉ </Text> }} />
   <Drawer.Screen name="Notificacoes" component={NotificacoesScreen} options={{ drawerLabel: 'Notificações', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> 🔔 </Text> }} />
   <Drawer.Screen name="EditProfile" component={EditProfileOlheiroScreen} options={{ drawerLabel: 'Editar Perfil', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}> 👤 </Text> }} />
 </Drawer.Navigator>
);

const InstituicaoDrawer = () => (
 <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: colors.background, width: 280 }, drawerActiveTintColor: colors.primary, drawerInactiveTintColor: colors.textSecondary }}>
   <Drawer.Screen name="HomeInstituicao" component={HomeInstituicaoScreen} options={{ drawerLabel: 'Início', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠 </Text> }} />
   <Drawer.Screen name="Atletas" component={AtletasScreen} options={{ drawerLabel: 'Meus Atletas', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚽ </Text> }} />
   <Drawer.Screen name="Agendamentos" component={AgendamentosScreen} options={{ drawerLabel: 'Agendamentos', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅 </Text> }} />
   <Drawer.Screen name="Convites" component={ConvitesScreen} options={{ drawerLabel: 'Convites', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✉ </Text> }} />
   <Drawer.Screen name="Notificacoes" component={NotificacoesScreen} options={{ drawerLabel: 'Notificações', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔔 </Text> }} />
   <Drawer.Screen name="EditProfile" component={EditProfileInstituicaoScreen} options={{ drawerLabel: 'Editar Perfil', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏫 </Text> }} />
 </Drawer.Navigator>
);

const ResponsavelDrawer = () => (
 <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: colors.background, width: 280 }, drawerActiveTintColor: colors.primary, drawerInactiveTintColor: colors.textSecondary }}>
   <Drawer.Screen name="HomeResponsavel" component={HomeResponsavelScreen} options={{ drawerLabel: 'Início', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠 </Text> }} />
   <Drawer.Screen name="Atletas" component={AtletasScreen} options={{ drawerLabel: 'Atletas', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚽ </Text> }} />
   <Drawer.Screen name="Notificacoes" component={NotificacoesScreen} options={{ drawerLabel: 'Notificações', drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔔 </Text> }} />
 </Drawer.Navigator>
);

// Stack principal para usuários autenticados
const MainStack = ({ userType }) => {
    const userDrawerScreens = [];

    if (userType === 'olheiro') {
        userDrawerScreens.push(<Stack.Screen name="OlheiroDrawer" component={OlheiroDrawer} key="olheiro" />);
    } else if (userType === 'instituicao') {
        userDrawerScreens.push(<Stack.Screen name="InstituicaoDrawer" component={InstituicaoDrawer} key="instituicao" />);
    } else if (userType === 'responsavel') {
        userDrawerScreens.push(<Stack.Screen name="ResponsavelDrawer" component={ResponsavelDrawer} key="responsavel" />);
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}
        >
            {AuthStack}        

            
            <Stack.Screen 
                name="SplashScreen" 
                component={SplashScreen}                
            />
            <Stack.Screen 
                name="LoginScreen" 
                component={LoginScreen}                
            />
            <Stack.Screen 
                name="CreateAccountScreen"
                component={CreateAccountScreen}                
            />
        </Stack.Navigator>
    );

};


const AppNavigator = () => {
 const { isAuthenticated, loading, userData } = useAuth();
 const [showSplash, setShowSplash] = React.useState(true);

 if (loading) {
   return <SplashScreen />;
 }
 
 return (
   <NavigationContainer
     theme={{
       dark: true,
       colors: {
         primary: colors.primary,
         background: colors.background,
         card: colors.backgroundCard,
         text: colors.textPrimary,
         border: colors.inputBorder,
         notification: colors.primary,
       },
      }}
    >
      {isAuthenticated && userData ? (
        <MainStack userType={userData.userType} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;