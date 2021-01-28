const mongoose = require('mongoose');
const Post = mongoose.model('Post');


exports.index = async (req,res) => {
    /*
    res.render('home', {
        nome  : req.query.nome || 'Visitante',
        idade : req.query.idade,
        mostrar: true,
        ingredientes : [
            {nome: 'Arroz', quantidade: '10'},
            {nome: 'Feijão', quantidade: '5'},
        ],
        interesses:['node','PHP','react'],
        listaTarefas:[{nomeTarefa: 'Estudar Node JS'}],
       
    });
    */

    let data = {
        pageTitle : 'HOME',
        listPosts : [],
    };

    const posts    = await Post.find();
    data.listPosts = posts;
    
    res.render('home',data);
}



