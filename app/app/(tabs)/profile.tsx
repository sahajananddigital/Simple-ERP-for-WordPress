import { StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import i18n from '../../services/i18n';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const [locale, setLocale] = useState(i18n.locale);

    const toggleLanguage = () => {
        const newLocale = i18n.locale === 'en' ? 'gu' : 'en';
        i18n.locale = newLocale;
        setLocale(newLocale); // Trigger re-render
    };

    const ActionRow = ({ title, icon, onPress, color, rightText }) => (
        <TouchableOpacity style={[styles.row, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]} onPress={onPress}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color ? color + '20' : Colors[colorScheme ?? 'light'].tint + '20' }]}>
                    <FontAwesome name={icon} size={18} color={color || Colors[colorScheme ?? 'light'].tint} />
                </View>
                <Text style={[styles.rowTitle, color && { color }]}>{title}</Text>
            </View>
            <View style={styles.rowRight}>
                {rightText && <Text style={styles.rightText}>{rightText}</Text>}
                <FontAwesome name="angle-right" size={20} color={Colors[colorScheme ?? 'light'].icon} />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{i18n.t('profile')}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Nandvana Jagdish</Text>
                        <Text style={styles.profilePhone}>+91 92777 59567</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].card, paddingVertical: 0 }]}>
                <ActionRow title={i18n.t('editProfile')} icon="user" onPress={() => { }} />
                <ActionRow
                    title={i18n.t('changeLanguage')}
                    icon="language"
                    onPress={toggleLanguage}
                    rightText={i18n.locale.toUpperCase()}
                />
                <ActionRow title={i18n.t('logout')} icon="sign-out" onPress={() => { }} color="#E63946" />
            </View>

            <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>{i18n.t('deleteAccount')}</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'transparent'
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold'
    },
    card: {
        margin: 20,
        marginTop: 0,
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarContainer: {
        marginRight: 20
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    profileInfo: {
        justifyContent: 'center'
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    profilePhone: {
        fontSize: 16,
        opacity: 0.6
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '500'
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    rightText: {
        fontSize: 14,
        opacity: 0.5
    },
    deleteButton: {
        backgroundColor: '#FFE5E5',
        margin: 20,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center'
    },
    deleteButtonText: {
        color: '#D93025',
        fontWeight: '600',
        fontSize: 16
    }
});
