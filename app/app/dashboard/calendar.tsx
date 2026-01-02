import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';

export default function CalendarScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/calendar-events');
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'festival': return '#E67E22'; // Orange
            case 'ekadashi': return '#8E44AD'; // Purple
            case 'poonam': return '#F1C40F'; // Yellow
            case 'amavasya': return '#2C3E50'; // Dark
            default: return '#3498DB'; // Blue
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={[styles.dateBox, { backgroundColor: getEventTypeColor(item.event_type) }]}>
                <Text style={styles.dateText}>{item.event_date.split('-')[2]}</Text>
                <Text style={styles.monthText}>{new Date(item.event_date).toLocaleString('default', { month: 'short' })}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.badgeContainer}>
                    <Text style={[styles.badge, { backgroundColor: getEventTypeColor(item.event_type) + '33', color: getEventTypeColor(item.event_type) }]}>
                        {item.event_type.toUpperCase()}
                    </Text>
                </View>
                {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Calendar' }} />
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 15 },
    card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 2 },
    dateBox: { padding: 15, alignItems: 'center', justifyContent: 'center', width: 70 },
    dateText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    monthText: { color: 'white', fontSize: 12, textTransform: 'uppercase' },
    content: { padding: 15, flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    badgeContainer: { flexDirection: 'row', marginBottom: 5 },
    badge: { fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: '600' },
    description: { fontSize: 14, color: '#666' }
});
