import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import AgendamentoService from '../services/newAgendamentoService';
import ConviteService from '../services/conviteService';
import LoadingScreen from '../components/LoadingScreen';

// --- NOVO COMPONENTE: Modal de Seleção de Instituição ---
const InstituicaoSelectModal = ({ visible, onClose, onSelect, instituicoes }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={selectModalStyles.item}
      onPress={() => onSelect(item)}
    >
      <Text style={selectModalStyles.itemText}>{item.nomeEscola || 'Instituição sem nome'}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={selectModalStyles.container}>
        <View style={selectModalStyles.content}>
          <View style={selectModalStyles.header}>
            <Text style={selectModalStyles.title}>Selecionar Instituição</Text>
          </View>
          
          <FlatList
            data={instituicoes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={selectModalStyles.emptyText}>Nenhuma instituição disponível.</Text>}
            style={selectModalStyles.list}
          />

          <TouchableOpacity onPress={onClose} style={selectModalStyles.closeButton}>
            <Text style={selectModalStyles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AgendamentosScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [novoAgendamentoModal, setNovoAgendamentoModal] = useState(false);
  const [instituicoes, setInstituicoes] = useState([]);
  const [selectInstituicaoModal, setSelectInstituicaoModal] = useState(false); // Estado para o novo modal

  // Estados para novo agendamento
  const [selectedInstituicao, setSelectedInstituicao] = useState(null);
  const [dataVisita, setDataVisita] = useState(new Date());
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Use useCallback para funções que não mudam (evita re-renderizações desnecessárias)
  const loadAgendamentos = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (userData.userType === 'olheiro') {
        result = await AgendamentoService.buscarAgendamentosPorOlheiro(userData.uid);
      } else {
        result = await AgendamentoService.buscarAgendamentosPorInstituicao(userData.uid);
      }
      if (result.success) {
        // Ordenar por data (opcional: mais recente primeiro)
        const sortedAgendamentos = result.agendamentos.sort((a, b) => 
          (b.dataVisita?.seconds || 0) - (a.dataVisita?.seconds || 0)
        );
        setAgendamentos(sortedAgendamentos);
      } else {
        Alert.alert('Erro', 'Erro ao carregar agendamentos');
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Erro inesperado ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, [userData.uid, userData.userType]);

  const loadInstituicoes = useCallback(async () => {
    try {
      const result = await ConviteService.buscarInstituicoesParaConvite();
      if (result.success) {
        setInstituicoes(result.instituicoes);
      }
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
    }
  }, []);

  useEffect(() => {
    loadAgendamentos();
    if (userData.userType === 'olheiro') {
      loadInstituicoes();
    }
  }, [loadAgendamentos, loadInstituicoes, userData.userType]); // Dependências corrigidas

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Funções de formatação e status (mantidas)
  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return colors.warning;
      case 'confirmado': return colors.success;
      case 'realizado': return colors.info;
      case 'cancelado': return colors.error;
      default: return colors.textMuted;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'confirmado': return 'Confirmado';
      case 'realizado': return 'Realizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Tratamento mais robusto para Timestamps do Firebase e objetos Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000); 
    return date.toLocaleDateString('pt-BR');
  };

  const handleAgendamentoPress = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setModalVisible(true);
  };

  // Funções de Ação (Confirmar, Cancelar, Realizar - mantidas)
  const handleConfirmarAgendamento = async (agendamentoId) => {
    try {
      const result = await AgendamentoService.confirmarAgendamento(agendamentoId);
      if (result.success) {
        Alert.alert('Sucesso', 'Agendamento confirmado!');
        loadAgendamentos();
        setModalVisible(false);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao confirmar agendamento');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado');
    }
  };

  const handleCancelarAgendamento = (agendamentoId) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await AgendamentoService.cancelarAgendamento(agendamentoId);
              if (result.success) {
                Alert.alert('Sucesso', 'Agendamento cancelado!');
                loadAgendamentos();
                setModalVisible(false);
              } else {
                Alert.alert('Erro', result.error || 'Erro ao cancelar agendamento');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro inesperado');
            }
          }
        }
      ]
    );
  };

  const handleMarcarRealizado = async (agendamentoId) => {
    try {
      const result = await AgendamentoService.marcarComoRealizado(agendamentoId);
      if (result.success) {
        Alert.alert('Sucesso', 'Agendamento marcado como realizado!');
        loadAgendamentos();
        setModalVisible(false);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao marcar como realizado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado');
    }
  };

  // Novo Agendamento
  const resetNovoAgendamentoForm = () => {
    setSelectedInstituicao(null);
    setDataVisita(new Date());
    setHorario('');
    setObservacoes('');
  };

  const handleSelectInstituicao = (instituicao) => {
    setSelectedInstituicao(instituicao);
    setSelectInstituicaoModal(false);
  };

  const handleCriarAgendamento = async () => {
    if (!selectedInstituicao || !horario.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (Instituição e Horário)');
      return;
    }
    
    // Validação básica de horário (HH:MM)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.trim())) {
      Alert.alert('Erro', 'O horário deve estar no formato HH:MM (ex: 14:30)');
      return;
    }

    try {
      // 1. Verificar disponibilidade
      const disponibilidade = await AgendamentoService.verificarDisponibilidade(
        selectedInstituicao.id,
        dataVisita,
        horario.trim()
      );

      if (!disponibilidade.success || !disponibilidade.disponivel) {
        Alert.alert('Erro', disponibilidade.error || 'Este horário já está ocupado ou ocorreu um erro na verificação. Escolha outro horário.');
        return;
      }

      // 2. Criar agendamento
      const agendamentoData = {
        olheiroId: userData.uid,
        instituicaoId: selectedInstituicao.id,
        dataVisita: dataVisita, 
        horario: horario.trim(),
        observacoes: observacoes.trim()
      };

      const result = await AgendamentoService.criarAgendamento(agendamentoData);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Agendamento criado com sucesso! Ele aparecerá como "Pendente" até ser confirmado pela instituição.');
        setNovoAgendamentoModal(false);
        resetNovoAgendamentoForm();
        loadAgendamentos();
      } else {
        Alert.alert('Erro', result.error || 'Erro ao criar agendamento');
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Alert.alert('Erro', 'Erro inesperado ao criar agendamento');
    }
  };

  const renderAgendamentoCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.agendamentoCard}
      onPress={() => handleAgendamentoPress(item)}
    >
      <View style={styles.agendamentoHeader}>
        <Text style={styles.agendamentoTitulo} numberOfLines={1}>
          {userData.userType === 'olheiro' 
            ? item.instituicao?.nomeEscola || 'Instituição Desconhecida'
            : item.olheiro?.nome || 'Olheiro Desconhecido'
          }
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.agendamentoInfo}>
        <Text style={styles.agendamentoData}>
          🗓️ {formatDate(item.dataVisita)} às {item.horario}
        </Text>
        {item.observacoes && (
          <Text style={styles.agendamentoObservacoes} numberOfLines={2}>
            📝 {item.observacoes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>Nenhum Agendamento Encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {userData.userType === 'olheiro' 
          ? 'Use o botão abaixo para solicitar uma visita a uma instituição.'
          : 'Seus agendamentos aparecerão aqui após serem solicitados por um olheiro.'
        }
      </Text>
      {userData.userType === 'olheiro' && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setNovoAgendamentoModal(true)}
        >
          <Text style={styles.addButtonText}>Agendar Nova Visita</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && agendamentos.length === 0) {
    return <LoadingScreen message="Carregando agendamentos..." />;
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendamentos</Text>
          {userData.userType === 'olheiro' && (
            <TouchableOpacity 
              style={styles.addHeaderButton}
              onPress={() => setNovoAgendamentoModal(true)}
            >
              <Text style={styles.addHeaderButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de agendamentos */}
        <FlatList
          data={agendamentos}
          renderItem={renderAgendamentoCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.agendamentosList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading && renderEmptyState}
          onRefresh={loadAgendamentos}
          refreshing={loading}
        />

        {/* Modal de detalhes do agendamento */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              {selectedAgendamento && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      {userData.userType === 'olheiro' ? 'Instituição:' : 'Olheiro:'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {userData.userType === 'olheiro' 
                        ? selectedAgendamento.instituicao?.nomeEscola || 'N/A'
                        : selectedAgendamento.olheiro?.nome || 'N/A'
                      }
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Data:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedAgendamento.dataVisita)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Horário:</Text>
                    <Text style={styles.detailValue}>{selectedAgendamento.horario}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedAgendamento.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(selectedAgendamento.status)}</Text>
                    </View>
                  </View>
                  {selectedAgendamento.observacoes && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Observações:</Text>
                      <Text style={styles.detailValue}>
                        {selectedAgendamento.observacoes}
                      </Text>
                    </View>
                  )}
                  {/* Ações */}
                  <View style={styles.actionsContainer}>
                    {selectedAgendamento.status === 'pendente' && userData.userType === 'instituicao' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={() => handleConfirmarAgendamento(selectedAgendamento.id)}
                      >
                        <Text style={styles.actionButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    )}
                    {(selectedAgendamento.status === 'pendente' || selectedAgendamento.status === 'confirmado') && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancelarAgendamento(selectedAgendamento.id)}
                      >
                        <Text style={styles.actionButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                    {selectedAgendamento.status === 'confirmado' && userData.userType === 'instituicao' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleMarcarRealizado(selectedAgendamento.id)}
                      >
                        <Text style={styles.actionButtonText}>Marcar Realizado</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal de novo agendamento */}
        <Modal
          visible={novoAgendamentoModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setNovoAgendamentoModal(false);
            resetNovoAgendamentoForm(); // Limpa o formulário ao fechar
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Novo Agendamento</Text>
                <TouchableOpacity onPress={() => {
                  setNovoAgendamentoModal(false);
                  resetNovoAgendamentoForm();
                }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                {/* Seleção de instituição */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Instituição *</Text>
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => setSelectInstituicaoModal(true)}
                  >
                    <Text style={styles.selectButtonText}>
                      {selectedInstituicao ? selectedInstituicao.nomeEscola : 'Selecionar instituição'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Data da visita */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Data da Visita *</Text>
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.selectButtonText}>
                      {dataVisita.toLocaleDateString('pt-BR')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={dataVisita}
                    mode="date"
                    display="default"
                    minimumDate={new Date()} // Impedir agendamentos retroativos
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                         setDataVisita(selectedDate);
                      }
                    }}
                  />
                )}
                
                {/* Horário */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Horário * (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 14:00"
                    placeholderTextColor={colors.textMuted}
                    value={horario}
                    onChangeText={(text) => setHorario(text.replace(/[^0-9:]/g, ''))} // Limita caracteres
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </View>

                {/* Observações */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Observações</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Detalhes adicionais sobre a visita..."
                    placeholderTextColor={colors.textMuted}
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCriarAgendamento}
                >
                  <Text style={styles.createButtonText}>Criar Agendamento</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Seleção de Instituição (separado) */}
        {userData.userType === 'olheiro' && (
          <InstituicaoSelectModal
            visible={selectInstituicaoModal}
            onClose={() => setSelectInstituicaoModal(false)}
            onSelect={handleSelectInstituicao}
            instituicoes={instituicoes}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// --- Estilos para o Modal de Seleção de Instituição ---
const selectModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    paddingBottom: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: colors.textMuted,
  },
  closeButton: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
});

// --- Estilos do componente principal (melhorados) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15, // Reduzido um pouco o padding
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder, // Adicionado separador
  },
  menuButton: {
    width: 30,
    height: 30,
    justifyContent: 'space-around', // Usar 'space-around' ou 'space-between'
    paddingVertical: 5,
  },
  menuLine: {
    height: 2,
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22, // Levemente maior
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  addHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHeaderButtonText: {
    color: colors.textPrimary, // Corrigido para a cor de texto (deve ser branco ou claro se primary for escuro)
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28, // Ajuste para centralizar o '+'
  },
  agendamentosList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  agendamentoCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  agendamentoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 10, // Espaço entre o título e o badge
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agendamentoInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    paddingTop: 10,
  },
  agendamentoData: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  agendamentoObservacoes: {
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12, // Um pouco menos redondo
    elevation: 2,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textMuted,
  },
  modalBody: {
    maxHeight: '80%',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start', // Alinhamento para suportar texto longo
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginRight: 10,
    width: 100, // Largura fixa para rótulos para melhor alinhamento
  },
  detailValue: {
    fontSize: 16,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    paddingTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  completeButton: {
    backgroundColor: colors.info,
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    color: colors.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  selectButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  createButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AgendamentosScreen;