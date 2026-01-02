import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';

const ProgramImage = ({ uri }: { uri: string }) => {
    const [error, setError] = useState(false);
    const fallback = require('../../assets/images/daily_program.png');

    useEffect(() => {
        setError(false);
    }, [uri]);

    return (
        <Image
            source={error ? fallback : { uri: `${uri}?t=${new Date().getTime()}` }}
            style={styles.image}
            resizeMode="contain"
            onError={() => setError(true)}
        />
    );
};

export default function DailyProgramScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/daily-programs');
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.date}>{item.program_date}</Text>
            {item.image_url ? (
                <ProgramImage uri={item.image_url} />
            ) : (
                <Text style={styles.noImage}>No Flyer Available</Text>
            )}
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daily Programs' }} />
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
    card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 20, padding: 15, elevation: 3 },
    date: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    image: { width: '100%', aspectRatio: 0.7, borderRadius: 8, backgroundColor: '#f0f0f0' },
    noImage: { textAlign: 'center', padding: 20, color: '#999' }
});
