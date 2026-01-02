import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ImageBackground, ActivityIndicator, View } from 'react-native';
import { Text, View as ThemedView } from '../../components/Themed';
import api from '../../services/api';
import { Stack } from 'expo-router';

const QuoteImageBackground = ({ uri, children }: { uri: string; children: React.ReactNode }) => {
    const [error, setError] = useState(false);
    const fallback = require('../../assets/images/daily_quotes.png');

    useEffect(() => {
        setError(false);
    }, [uri]);

    return (
        <ImageBackground
            source={error ? fallback : { uri: `${uri}?t=${new Date().getTime()}` }}
            style={styles.card}
            imageStyle={{ borderRadius: 12 }}
            onError={() => setError(true)}
        >
            {children}
        </ImageBackground>
    );
};

export default function DailyQuotesScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/content/daily-quotes');
            setItems(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.cardContainer}>
            {item.image_url ? (
                <QuoteImageBackground uri={item.image_url}>
                    <View style={styles.overlay}>
                        <Text style={styles.quoteText}>"{item.quote_text}"</Text>
                        <Text style={styles.author}>- {item.author}</Text>
                    </View>
                </QuoteImageBackground>
            ) : (
                <View style={[styles.card, { backgroundColor: '#f5f5f5', padding: 20 }]}>
                    <Text style={[styles.quoteText, { color: '#333' }]}>"{item.quote_text}"</Text>
                    <Text style={[styles.author, { color: '#666' }]}>- {item.author}</Text>
                </View>
            )}
            <Text style={styles.date}>{item.quote_date}</Text>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daily Quotes' }} />
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
    cardContainer: { marginBottom: 20 },
    card: { minHeight: 200, justifyContent: 'center', borderRadius: 12, overflow: 'hidden' },
    overlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, flex: 1, justifyContent: 'center' },
    quoteText: { color: 'white', fontSize: 18, fontStyle: 'italic', textAlign: 'center', marginBottom: 10 },
    author: { color: 'white', textAlign: 'right', fontWeight: 'bold' },
    date: { textAlign: 'right', marginTop: 5, color: '#888', fontSize: 12 }
});
