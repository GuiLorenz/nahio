import { StyleSheet } from 'react-native';
import { colors } from './colors';
export const globalStyles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
 },
 safeArea: {
   flex: 1,
   backgroundColor: colors.background,
 },
 centerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: colors.background,
   paddingHorizontal: 20,
 },
 // Textos
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   color: colors.textPrimary,
   textAlign: 'center',
   marginBottom: 10,
 },
 subtitle: {
   fontSize: 16,
   color: colors.textSecondary,
   textAlign: 'center',
   marginBottom: 20,
 },
 bodyText: {
   fontSize: 14,
   color: colors.textPrimary,
   lineHeight: 20,
 },
 // Botões
 primaryButton: {
   backgroundColor: colors.primary,
   paddingVertical: 15,
   paddingHorizontal: 30,
   borderRadius: 25,
   alignItems: 'center',
   marginVertical: 10,
 },
 primaryButtonText: {
   color: colors.textPrimary,
   fontSize: 16,
   fontWeight: 'bold',
 },
 secondaryButton: {
   backgroundColor: 'transparent',
   borderWidth: 2,
   borderColor: colors.primary,
   paddingVertical: 15,
   paddingHorizontal: 30,
   borderRadius: 25,
   alignItems: 'center',
   marginVertical: 10,
 },
 secondaryButtonText: {
   color: colors.primary,
   fontSize: 16,
   fontWeight: 'bold',
 },
 // Inputs
 input: {
   backgroundColor: colors.inputBackground,
   borderWidth: 1,
   borderColor: colors.inputBorder,
   borderRadius: 10,
   paddingVertical: 15,
   paddingHorizontal: 20,
   color: colors.textPrimary,
   fontSize: 16,
   marginVertical: 8,
 },
 inputFocused: {
   borderColor: colors.inputBorderFocus,
 },
 inputLabel: {
   color: colors.textSecondary,
   fontSize: 14,
   marginBottom: 5,
   marginLeft: 5,
 },
 // Cards
 card: {
   backgroundColor: colors.backgroundCard,
   borderRadius: 15,
   padding: 20,
   marginVertical: 10,
   shadowColor: colors.shadowColor,
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
 },
 // Loading
 loadingContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: colors.background,
},
// Progress Bar
progressContainer: {
width: '100%',
height: 6,
backgroundColor: colors.backgroundSecondary,
borderRadius: 3,
marginVertical: 20,
},
progressBar: {
height: '100%',
backgroundColor: colors.primary,
borderRadius: 3,
},
// Spacing
marginTop10: { marginTop: 10 },
marginTop20: { marginTop: 20 },
marginBottom10: { marginBottom: 10 },
marginBottom20: { marginBottom: 20 },
paddingHorizontal20: { paddingHorizontal: 20 },
paddingVertical20: { paddingVertical: 20 },
});