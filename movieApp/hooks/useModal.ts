import { useState } from 'react';

type ModalType = 'info' | 'success' | 'warning' | 'error';

const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<ModalType>('info');

  const showModal = (title: string, message: string, type: ModalType = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  }

  const hideModal = () => {
    setModalVisible(false);
  }

  return {
    modalVisible,
    modalTitle,
    modalMessage,
    modalType,
    showModal,
    hideModal,
  }
}

export default useModal