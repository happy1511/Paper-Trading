import Home from './Pages/Home'
function App() {
  // const [h, setH] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(process.env.REACT_APP_SERVER_URL+'/getAllSymbols');
  //       console.log(response.data)
  //       setH(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Home />
  );
}

export default App;
