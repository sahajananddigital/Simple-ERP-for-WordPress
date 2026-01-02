import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DailySatsangScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/daily-satsang');
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const openVideo = (url: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => openVideo(item.video_url)}>
            <View style={styles.videoPlaceholder}>
                <Ionicons name="play-circle-outline" size={64} color="#fff" />
            </View>
            <View style={styles.content}>
                <Text style={styles.date}>{item.satsang_date}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daily Satsang' }} />
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
    card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 20, overflow: 'hidden', elevation: 3 },
    videoPlaceholder: { height: 200, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
    content: { padding: 15 },
    date: { fontSize: 12, color: '#888', marginBottom: 5 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    description: { fontSize: 14, color: '#444' }
});
