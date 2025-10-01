import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator // Adicionado para um feedback de loading melhor
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// CORREÇÃO: Removido espaço nos caminhos de importação
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha seu e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        Alert.alert('Erro no Login', result.error || 'Não foi possível entrar. Verifique suas credenciais.');
      }
      // Se o login for bem-sucedido, o AppNavigator fará a troca de tela automaticamente.
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // CORREÇÃO: O nome da rota deve ser 'ForgotPassword', como definido no seu AuthStack
    navigation.navigate('ForgotPassword');
  };

  const handleCreateAccount = () => {
    // CORREÇÃO: O nome da rota deve ser 'CreateAccount', como definido no seu AuthStack
    navigation.navigate('CreateAccount');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Ajuda a fechar o teclado ao tocar fora
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
              {/* O seu código do logo está ótimo, mantido como estava */}
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

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Entre na sua conta</Text>
            <Text style={styles.subtitle}>Acesse a plataforma Nahio</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputFocused
                ]}
                placeholder="Digite seu e-mail"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  passwordFocused && styles.inputFocused
                ]}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry
              />
            </View>

            {/* Link Esqueci a senha */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Link Criar conta */}
            <TouchableOpacity
              style={styles.createAccountContainer}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createAccountText}>
                Não tem conta? <Text style={styles.createAccountLink}>Criar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Seus estilos estão ótimos, não precisam de alteração.
// Apenas colei aqui para o componente ficar completo.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
    },
    ball: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ballInner: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        position: 'relative',
    },
    hexagon: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: colors.background,
        borderRadius: 6,
    },
    hexagon1: { top: 10, left: 26 },
    hexagon2: { top: 26, left: 13 },
    hexagon3: { top: 26, right: 13 },
    hexagon4: { bottom: 26, left: 20 },
    hexagon5: { bottom: 10, right: 26 },
    flame: {
        position: 'absolute',
        right: -15,
        top: 15,
        width: 25,
        height: 50,
        backgroundColor: colors.primary,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        opacity: 0.8,
        transform: [{ skewY: '-15deg' }],
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 5,
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        color: colors.textPrimary,
        fontSize: 16,
    },
    inputFocused: {
        borderColor: colors.primary,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 30,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    createAccountContainer: {
        alignItems: 'center',
    },
    createAccountText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    createAccountLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;