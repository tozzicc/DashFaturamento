(async ()=>{
  try{
    const res = await fetch('http://localhost:3001/api/envio-tratador/mes');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('ERROR', e.message || e);
    process.exit(1);
  }
})();
