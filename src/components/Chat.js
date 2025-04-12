import { useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AuthContext } from './AuthProvider';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messages);
        });

        return unsubscribe;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            uid: currentUser.uid,
            email: currentUser.email,
            timestamp: serverTimestamp()
        });

        setNewMessage('');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat Room</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="message"
                        style={{
                            alignSelf: message.uid === currentUser.uid ? 'flex-end' : 'flex-start',
                            backgroundColor: message.uid === currentUser.uid ? '#dcf8c6' : 'white'
                        }}
                    >
                        <div className="message-sender">
                            {message.uid === currentUser.uid ? 'You' : message.email.split('@')[0]}
                        </div>
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">
                            {message.timestamp?.toDate().toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="message-form">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" className="send-btn">Send</button>
            </form>
        </div>
    );

}