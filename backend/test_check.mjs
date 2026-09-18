import { connectMongo, getDb, closeMongo } from './src/mongo.js';

async function check() {
  await connectMongo();
  const db = await getDb();
  
  const user = await db.collection("users").findOne({ email: /pushpendra/i });
  console.log("Pushpendra User:", user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null);
  
  const allInst = await db.collection("instruments").find({}).toArray();
  const pushInst = allInst.filter(i => JSON.stringify(i).toLowerCase().includes("pushpendra") || i.businessId === user?.id || i.ownerEmail === user?.email);
  console.log("Pushpendra Instruments:", pushInst.length, "out of total", allInst.length);
  
  const allApp = await db.collection("applications").find({}).toArray();
  const pushApp = allApp.filter(a => JSON.stringify(a).toLowerCase().includes("pushpendra") || a.businessId === user?.id);
  console.log("Pushpendra Applications:", pushApp.length, "out of total", allApp.length);

  const allAssign = await db.collection("assignments").find({}).toArray();
  const pushAssign = allAssign.filter(a => JSON.stringify(a).toLowerCase().includes("pushpendra") || a.businessId === user?.id);
  console.log("Pushpendra Assignments:", pushAssign.length, "out of total", allAssign.length);

  const allReports = await db.collection("reports").find({}).toArray();
  const pushReports = allReports.filter(r => JSON.stringify(r).toLowerCase().includes("pushpendra") || r.userId === user?.id);
  console.log("Pushpendra Reports:", pushReports.length, "out of total", allReports.length);

  const allCerts = await db.collection("certificates").find({}).toArray();
  const pushCerts = allCerts.filter(c => JSON.stringify(c).toLowerCase().includes("pushpendra") || c.ownerEmail === user?.email);
  console.log("Pushpendra Certificates:", pushCerts.length, "out of total", allCerts.length);

  await closeMongo();
}

check().catch(console.error);
