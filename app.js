import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  const baseURL = "http://10.0.2.2:3000";

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${baseURL}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load students");
    }
  };

  const markAttendance = async (id, status) => {
    try {
      await fetch(`${baseURL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: id, status })
      });
      setAttendance({...attendance, [id]: status});
    } catch (err) {
      Alert.alert("Error", "Failed to mark attendance");
    }
  };

  const addStudent = async () => {
    if (!name || !studentId) {
      Alert.alert("Error", "Enter name and ID");
      return;
    }
    try {
      await fetch(`${baseURL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, studentId })
      });
      setName("");
      setStudentId("");
      fetchStudents();
    } catch (err) {
      Alert.alert("Error", "Failed to add student");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Attendance</Text>
      
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          placeholder="Student Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          value={studentId}
          onChangeText={setStudentId}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addStudent}>
          <Text style={styles.btnText}>Add Student</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {students.map((student) => (
          <View key={student.id} style={styles.card}>
            <Text style={styles.name}>{student.name} ({student.studentId})</Text>
            {attendance[student.studentId] && (
              <Text style={styles.status}>Status: {attendance[student.studentId]}</Text>
            )}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.btn, styles.present]}
                onPress={() => markAttendance(student.studentId, 'present')}
              >
                <Text style={styles.btnText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.absent]}
                onPress={() => markAttendance(student.studentId, 'absent')}
              >
                <Text style={styles.btnText}>Absent</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  addForm: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  addBtn: { backgroundColor: '#007bff', padding: 12, borderRadius: 5 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 14, marginBottom: 10, color: '#666' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 10, borderRadius: 5, marginHorizontal: 5 },
  present: { backgroundColor: '#28a745' },
  absent: { backgroundColor: '#dc3545' },
});