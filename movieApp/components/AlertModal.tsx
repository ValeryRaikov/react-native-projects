
import React from 'react';
import { View, Image, Text, TouchableOpacity, Modal } from 'react-native';
import { icons } from '@/constants/icons';

const AlertModal = ({ visible, onClose, title, message, type }: any) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return icons.tick; 
      case 'error':
        return icons.error;
      case 'warning':
        return icons.warning; 
      default:
        return icons.info; 
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-primary rounded-2xl p-6 items-center shadow-lg w-4/5">
          <View className={`w-16 h-16 rounded-full ${getColor()} justify-center items-center mb-4`}>
            <Image source={getIcon()} className="size-10" />
          </View>
          
          <Text className="text-xl text-white font-bold mb-2 text-center">{title}</Text>
          <Text className="text-lg text-white mb-6 text-center">{message}</Text>
          
          <TouchableOpacity
            className={`w-full py-3 rounded-lg ${getColor()} items-center shadow`}
            onPress={onClose}
          >
            <Text className="text-white font-bold text-base">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default AlertModal