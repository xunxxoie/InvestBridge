import {
    Box,
    Button,
    Divider,
    Flex,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaBirthdayCake, FaEnvelope, FaLightbulb, FaPhone } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';

const DetailedProfileInfo = ({ userData, onUpdateProfile }) => {
    console.log(userData)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); //추가



    return (
        <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" transition="all 0.3s" _hover={{ boxShadow: "xl" }}>
            <VStack align="stretch" spacing={4}>
                <Text fontSize="xl" fontWeight="bold" color="brand.900">상세 프로필</Text>
                <Divider />
                <VStack align="stretch" spacing={3}>
                    <InfoItem icon={FaEnvelope} value={userData.userEmail} />
                    <InfoItem icon={FaBirthdayCake}  value={userData.birth} />
                    <InfoItem icon={FaPhone}  value={userData.phoneNumber} />
                </VStack>
            </VStack>

            <Button onClick={() => setIsEditModalOpen(true)}>프로필 수정</Button>
            <EditProfileModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                userData={userData}
                onUpdateProfile={onUpdateProfile}
            />
        </Box>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <Flex align="center" gap={3}>
        <Icon as={icon} boxSize={5} color="brand.500" />
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600">{label}</Text>
            <Text fontSize="md">{value}</Text>
        </Box>
    </Flex>
);

export default DetailedProfileInfo;