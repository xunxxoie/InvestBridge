import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

const EditProfileModal = ({ isOpen, onClose, userData, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    phoneNumber: '',
    birth: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        userEmail: userData.userEmail || '',
        phoneNumber: userData.phoneNumber || '',
        birth: userData.birth || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onUpdateProfile(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>프로필 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input 
              name="userEmail" 
              value={formData.userEmail} 
              onChange={handleChange} 
            />
          </FormControl>
          <FormControl>
            <FormLabel>전화번호</FormLabel>
            <Input 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
            />
          </FormControl>

        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            저장
          </Button>
          <Button variant="ghost" onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;