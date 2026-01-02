import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';

const UpdateImage = ({ uri }: { uri: string }) => {
    const [error, setError] = useState(false);
    const fallback = require('../../assets/images/daily_updates.png');

    useEffect(() => {
        setError(false);
    }, [uri]);

    return (
        <Image
            source={error ? fallback : { uri: `${uri}?t=${new Date().getTime()}` }}
            style={styles.image}
            onError={() => setError(true)}
        />
    );
};

export default function DailyUpdatesScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/daily-updates');
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            {item.image_url && (
                <UpdateImage uri={item.image_url} />
            )}
            <View style={styles.content}>
                <Text style={styles.date}>{item.update_date}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daily Updates' }} />
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
    image: { width: 100, height: '100%' },
    content: { padding: 15, flex: 1 },
    date: { fontSize: 12, color: '#888', marginBottom: 5 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    description: { fontSize: 14, color: '#444' }
});
