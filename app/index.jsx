import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function Index() {
  const [metalsData, setMetalsDate] = useState({});

  const metals = [
    { key: "XAU", name: "Gold" },
    { key: "XAG", name: "Silver" },
    { key: "XPT", name: "Platinum" },
    { key: "XPD", name: "Palladium" },
  ];

  useEffect(() => {
    const initialState = {};
    metals.forEach(item => {
      initialState[item.key] = { data: null, loading: true, error: null };
    });
    setMetalsDate(initialState);

    fetchingTheMetalsPrices();
  }, []);

  async function fetchingTheMetalsPrices() {
    metals.forEach(async (item) => {
      try {
        const response = await fetch(
          `https://api.gold-api.com/price/${item.key}`
        );

        const data = await response.json();

        setMetalsDate(prevData => ({
          ...prevData,
          [item.key]: { data, loading: false, error: null }
        }));

      } catch (error) {
        setMetalsDate(prevData => ({
          ...prevData,
          [item.key]: { data: null, loading: false, error: 'Error' }
        }));
      }
    });
  }

  return (
    <ScrollView style={styles.container}>
      {metals.map((item, index) => {
        const metal = metalsData[item.key];

        return (
          <Link
            key={item.key}
            href={{
              pathname: "/details",
              params: { metal: item.key }
            }}
            asChild
          >
            <Pressable>
              <Animated.View
                entering={FadeInUp.delay(index * 150)}
                style={styles.card}
              >
                <Text style={styles.title}>{item.name}</Text>

                {metal?.loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : metal?.error ? (
                  <Text style={styles.error}>Error loading data</Text>
                ) : (
                  <>
                    <Text style={styles.price}>
                      ₹{metal?.data?.price?.toFixed(2)}
                    </Text>
                    <Text style={styles.time}>
                      {new Date().toLocaleTimeString()}
                    </Text>
                  </>
                )}
              </Animated.View>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c3e50",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  error: {
    color: "red",
  },
});