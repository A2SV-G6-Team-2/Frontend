export const getDebts = async () => {
  const res = await fetch("/api/proxy/debts");
  return res.json();
};

export const createDebt = async (data:any) => {
  const res = await fetch("/api/proxy/debts",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  });

  return res.json();
};