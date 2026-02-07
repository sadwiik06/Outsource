const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

app.use(cors());
app.use(express.json())

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/health',(req,res)=>{
    res.send("Server running");
})
app.post('/api/posts',async(req,res)=>{
    try{
        const {user_id,image_url,caption} = req.body;
        const [result] = await pool.query("INSERT INTO posts (user_id,image_url,caption) VALUES (?,?,?)",[user_id,image_url,caption]);
        const [rows] = await pool.query("SELECT * FROM posts WHERE id=?",[result.insertId]);
        res.json(rows[0])
    }catch(err){
        console.error(err.message);
        res.status(500).json({error:"Server error ffghssfxbvgnm gffd fff"})
    }
})

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM posts WHERE id = ?";
        
        await pool.query(sql, [id]);
        res.json({ message: "Post deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/posts', async(req,res)=>{
    try{
        const [allPosts] = await pool.query("SELECT p.id, u.username, p.caption FROM posts p JOIN users u ON p.user_id = u.id");
        console.log("Posts found:", allPosts.length);
        console.log("Posts data:", allPosts);
        res.json(allPosts);
    }catch(err){
        console.log("Database error:", err.message);
        res.status(500).json({error: err.message});
    }
})


app.listen(5000,()=>{
    console.log("Server on port 5000");
});
