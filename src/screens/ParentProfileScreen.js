import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

export default function ParentProfileScreen() {
  const user = useSelector(state => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [children, setChildren] = useState([]);
  const [newChildName, setNewChildName] = useState('');
  const [parentInfo, setParentInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleAddChild = () => {
    if (!newChildName.trim()) {
      Alert.alert('Error', 'Please enter a child name');
      return;
    }
    setChildren([...children, { id: Date.now().toString(), name: newChildName.trim() }]);
    setNewChildName('');
  };

  const handleRemoveChild = (childId) => {
    setChildren(children.filter(child => child.id !== childId));
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parent Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'Guest User'}</Text>
          
          <Text style={styles.label}>Account Type:</Text>
          <Text style={styles.value}>{user?.isAnonymous ? 'Guest Account' : 'Registered Account'}</Text>

          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={parentInfo.name}
              onChangeText={(text) => setParentInfo({...parentInfo, name: text})}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{parentInfo.name || 'Not set'}</Text>
          )}

          <Text style={styles.label}>Phone:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={parentInfo.phone}
              onChangeText={(text) => setParentInfo({...parentInfo, phone: text})}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{parentInfo.phone || 'Not set'}</Text>
          )}

          <Text style={styles.label}>Address:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={parentInfo.address}
              onChangeText={(text) => setParentInfo({...parentInfo, address: text})}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.value}>{parentInfo.address || 'Not set'}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Children</Text>
          <Text style={styles.childCount}>{children.length} children</Text>
        </View>
        <View style={styles.childrenContainer}>
          {children.map(child => (
            <View key={child.id} style={styles.childItem}>
              <View style={styles.childInfo}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>{child.name[0]}</Text>
                </View>
                <Text style={styles.childName}>{child.name}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleRemoveChild(child.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addChildContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter child's name"
              value={newChildName}
              onChangeText={setNewChildName}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddChild}
            >
              <Text style={styles.addButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  childCount: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  childrenContainer: {
    marginTop: 10,
  },
  childItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  childAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  childName: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addChildContainer: {
    marginTop: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 