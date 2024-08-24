import axios from 'axios';
import React, { useRef } from 'react'
import io from 'socket.io-client';

const Console = ({ identifier , setWs , setError : seterr, stats }: { identifier: string, setWs : any, setError : any, stats : any }) => {
    const [socketConnectionToken, setSocketConnectionToken] = React.useState<any>("");
    const [error, setError] = React.useState<string>("");
    const [websocket, setWebsocket] = React.useState<any>(null);
    const [messages, setMessages] = React.useState<string[]>([]);
    let lastState = ''

    const stripAnsi = (text: string) => {
        return text.replace(/\x1b\[[0-9;]*m/g, '');
    };

    const ansiToCss = (text: string) => {
        // Use a stack to handle nested styles
        const styleStack: string[] = [];
        
        return text.replace(/\x1b\[([0-9;]*)m/g, (match, codes) => {
            const styles = codes.split(';').map((code : any) => parseInt(code, 10));
            let result = '';
    
            styles.forEach((style : any) => {
                switch (style) {
                    case 0: // Reset all styles
                        result += styleStack.map(s => `</span>`).reverse().join('');
                        styleStack.length = 0;
                        break;
                    case 1: // Bold
                        result += '<b>';
                        styleStack.push('</b>');
                        break;
                    case 22: // Reset Bold
                        result += '</b>';
                        break;
                    case 30: // Black (not usually used in text but handled for completeness)
                    case 31: // Red
                        result += '<span class="text-red-300">';
                        styleStack.push('</span>');
                        break;
                    case 32: // Green
                        result += '<span class="text-green-300">';
                        styleStack.push('</span>');
                        break;
                    case 33: // Yellow
                        result += '<span class="text-yellow-300">';
                        styleStack.push('</span>');
                        break;
                    case 34: // Blue
                        result += '<span class="text-blue-300">';
                        styleStack.push('</span>');
                        break;
                    case 35: // Magenta
                        result += '<span class="text-magenta-300">';
                        styleStack.push('</span>');
                        break;
                    case 36: // Cyan
                        result += '<span class="text-cyan-300">';
                        styleStack.push('</span>');
                        break;
                }
            });
    
            return result;
        }) + styleStack.map(s => `</span>`).reverse().join(''); // Close any remaining tags
    };
    const messagesEndRef = useRef<any>(null); // Step 1: Create a ref

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getSocketConnectionToken = async () => {
        try {
            // Ensure `identifier` is defined in the current scope
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/websocket/${identifier}`);
            // //console.log(response.data.data);
    
            const authDetails = response.data.data;
            setSocketConnectionToken(authDetails.token);
    
            // Check if the socket URL is valid
            if (!authDetails.socket) {
                throw new Error('WebSocket URL is missing in the response');
            }
    
            const ws = new WebSocket(`${authDetails.socket}`);
    
            ws.addEventListener('open', (event) => {
                //console.log('Connected to WebSocket');
                // Send authentication message
                ws.send(JSON.stringify({ event: 'auth', args: [authDetails.token] }));
            });
    
            ws.addEventListener('message', async(event) => {
                // //console.log('Message from server:', event.data);
                // //console.log('Message from server:', JSON.parse(event?.data.args[0]));

                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'console output' && data.args && Array.isArray(data.args)) {
                        const htmlMessages = data.args.map((msg : any) => ansiToCss(msg));
                        // //console.log('HTML messages:', htmlMessages);
                setMessages(prevMessages => [...prevMessages, ...htmlMessages]);
                scrollToBottom();
                }
                    if (data.event === 'token expiring' && data.args && Array.isArray(data.args)) {
                        await getSocketConnectionToken();
                }
                    if (data.event === 'stats' && data.args && Array.isArray(data.args)) {
                        // //console.log(JSON.parse(data.args[0]));
                        const newState = JSON.parse(data.args[0]).state;
                        // //console.log('lastState', lastState);
                        // //console.log('newState', newState);
                        
                        if(newState === lastState) {
                            // //console.log('lastState1', lastState);
                            
                            return;
                        }
                        else if (newState !== lastState) {
                            // //console.log('newState', newState);
                            lastState = newState;
                            // //console.log('lastState2', lastState);
                            setMessages(prevMessages => [...prevMessages, `[How2MC GSM]: Server is ${newState}`]);
                            scrollToBottom();
                        }
                        
                    }
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            });
    
            ws.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
                setError("Error connecting to server");
                seterr("Error connecting to server");
            });
    
            ws.addEventListener('close', (event) => {
                //console.log('WebSocket connection closed:', event);
            });
    
            setWebsocket(ws);
            setWs(ws);
    
        } catch (error: any) {
            console.error('Error fetching socket connection token:', error);
            setError(error.message);
        }
    };

    

    React.useEffect(() => {
        (async () => {
            await getSocketConnectionToken();
        })();
    }, [])
    return (
        <div className='px-2'>
            {error && <div>Error: {error}</div>}
            <div className='overflow-y-scroll max-h-[540px] '>
                {/* <h2>Messages:</h2> */}
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>

                    {messages.map((msg, index) => (
                        <div key={index} dangerouslySetInnerHTML={{__html: msg}} />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default Console