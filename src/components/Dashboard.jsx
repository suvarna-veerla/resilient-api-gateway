// ఒకవేళ నీ ఫైల్ పైన ఈ 'tokens' స్టేట్ లేకపోతే దీన్ని యాడ్ చేసుకో బ్రో
const [tokens, setTokens] = useState(5); 

const sendTraffic = async (isCrash) => {
    try {
      // 1. టోటల్ రిక్వెస్ట్స్ కౌంట్ పెంచడం
      setTotalRequests(prev => prev + 1);
      
      // 2. సర్క్యూట్ బ్రేకర్ కోర్ ఫంక్షనాలిటీ (Crash Server టెస్టింగ్)
      if (isCrash) {
        setCircuitState("OPEN");
        alert("⚠️ CIRCUIT BREAKER CRASH: State changed to OPEN! Direct SAP core channels isolated to prevent cascading down times.");
        if (typeof setSapData === 'function') setSapData([]);
        return;
      }

      // 3. టోకెన్ బకెట్ రేట్ లిమిటర్ కోర్ అల్గారిథమ్ (Rate Limiting)
      if (tokens <= 0) {
        setCircuitState("HALF-OPEN");
        alert("❌ RATE LIMIT EXCEEDED: HTTP Status 429 Too Many Requests! Token Bucket is empty. Dynamic refill in progress...");
        return;
      }

      // 4. నార్మల్ గా రన్ అవుతున్నప్పుడు సర్క్యూట్ క్లోజ్డ్ లో ఉంటుంది
      setCircuitState("CLOSED");
      setTokens(prev => prev - 1); // ప్రతి క్లిక్ కి ఒక టోకెన్ తగ్గుతుంది

      // రియల్ SAP OData రికార్డ్స్ లాంటి డైనమిక్ ఎంటర్‌ప్రైజ్ పేలోడ్ స్ట్రక్చర్
      const liveSapPayload = [
        { VBELN: "0010023451", MATNR: "SAP-OData-Core-99", ERDAT: "2026-08-19", NETWR: "75000.00", WAERK: "INR" },
        { VBELN: "0010023452", MATNR: "SAP-OData-Core-100", ERDAT: "2026-08-19", NETWR: "18200.00", WAERK: "INR" },
        { VBELN: "0010023453", MATNR: "SAP-OData-Core-101", ERDAT: "2026-08-19", NETWR: "95000.00", WAERK: "INR" }
      ];
      
      if (typeof setSapData === 'function') {
        setSapData(liveSapPayload);
      }
    } catch (error) {
      console.error("Gateway Processing Error:", error);
    }
};

// ప్రతి 10 సెకన్లకి బ్యాక్‌గ్రౌండ్ లో టోకెన్స్ ఆటోమేటిక్‌గా రీఫిల్ అయ్యే థ్రెడ్ లాజిక్
useEffect(() => {
    const refillInterval = setInterval(() => {
      setTokens(prev => (prev < 5 ? prev + 1 : 5));
    }, 10000); 
    return () => clearInterval(refillInterval);
}, []);
