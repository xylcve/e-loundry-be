// TODO fix this test
const check_batch = await fetch(
    "http://localhost:3001/api/v1/iot/rfid/consume",
    {
        method: "post",
        body: JSON.stringify({ batch: ["a", "b", "c", "d"] }),
        headers: { "Content-Type": "application/json", "Authorization": "Bearer DEMO" }
    }
)

const check_single = await fetch(
    "http://localhost:3001/api/v1/iot/rfid/consume",
    {
        method: "post",
        body: JSON.stringify({ single: "A" }),
        headers: { "Content-Type": "application/json", "Authorization": "Bearer DEMO" }
    }
)