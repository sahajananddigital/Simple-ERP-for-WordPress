import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';

const DarshanImage = ({ uri }: { uri: string }) => {
    const [error, setError] = useState(false);
    const fallback = require('../../assets/images/daily_darshan.png');

    useEffect(() => {
        setError(false);
    }, [uri]);

    return (
        <Image
            source={error ? fallback : { uri }}
            style={styles.image}
            onError={(e) => {
                console.log("Image Load Error for:", uri, e.nativeEvent.error);
                setError(true);
            }}
        />
    );
};

export default function DailyDarshanScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/daily-darshan');
            // console.log("Darshan Data:", JSON.stringify(response.data, null, 2));
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.date}>{item.date} ({item.time})</Text>
            <View style={styles.imageGrid}>
                {item.images.map((img: any, idx: number) => (
                    <DarshanImage key={idx} uri={`${img.url}?t=${new Date().getTime()}`} />
                ))}
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daily Darshan' }} />
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
    card: { marginBottom: 20 },
    date: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    image: { width: '48%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#eee', resizeMode: 'cover' }
});
