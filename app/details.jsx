import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Details() {
  const { metal } = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetalDetails();
  }, []);

  async function fetchMetalDetails() {
    try {
      const response = await fetch(
        `https://api.gold-api.com/price/${metal}`
      );

      const result = await response.json();

      setData(result);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const metalNameMap = {
    XAU: "Gold",
    XAG: "Silver",
    XPT: "Platinum",
    XPD: "Palladium",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {metalNameMap[metal]} Details
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Price</Text>
        <Text style={styles.value}>
          ₹{data?.price?.toFixed(2)}
        </Text>

        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Open</Text>
            <Text style={styles.smallValue}>
              ₹{data?.open_price?.toFixed(2) || "--"}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Prev Close</Text>
            <Text style={styles.smallValue}>
              ₹{data?.prev_close_price?.toFixed(2) || "--"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Date</Text>
        <Text style={styles.smallValue}>
          {new Date().toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Time</Text>
        <Text style={styles.smallValue}>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: 5,
  },
  smallValue: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  box: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "gray",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});