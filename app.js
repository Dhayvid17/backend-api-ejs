const express = require('express');

const app = express();
const fs = require('fs');
const path = require('path');

//Register view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


//Middleware for static file and to enable my CSS
app.use(express.static('public'));


//Route for HomePage
app.get('/', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        const blogresults = JSON.parse(data);
        res.render('index', { title: 'Home', blogresults });
    });

});


// Route for AboutPage
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});


//Route for Create Page
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create' });
});


//Route for form submission
app.post('/blogs/create', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        const blogresults = JSON.parse(data);
        const newBlog = {
            id: blogresults.length + 1,
            title: req.body.title,
            snippet: req.body.snippet,
            body: req.body.body
        };

        blogresults.push(newBlog);

        fs.writeFile('data.json', JSON.stringify(blogresults, null, 2), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error Reading Data');
                return;
            }
            res.redirect('/');
        });
    });
});


//Route to each blog body
app.get('/fullstory/:id', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        const blogresults = JSON.parse(data);
        const blogresult = blogresults.find(body => body.id == req.params.id);
        if (blogresult) {
            res.render('fullstory', { blogresult, title: 'Full Story' });
        } else {
            console.log(err);
            res.status(404).send('No blog story found');
        }
    });
});

//Route for update post//
app.get('/blog/update/:id', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        const blogresults = JSON.parse(data);
        const blogresult = blogresults.find(blogresult => blogresult.id == req.params.id);
        if (blogresult) {
            res.render('update', {blogresult, title: 'Update Blog'});
        } else {
            res.status(404).send('Blog not found');
        }
    });
});

//Route to submit updated post// 
app.post('/blog/update/:id', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        let blogresults = JSON.parse(data);
        const blogresultIndex = blogresults.findIndex(blogresult => blogresult.id == req.params.id);
        if(blogresultIndex !== -1) {
            blogresults[blogresultIndex].title = req.body.title;
            blogresults[blogresultIndex].snippet = req.body.snippet;
            blogresults[blogresultIndex].body = req.body.body;

            fs.writeFile('data.json', JSON.stringify(blogresults, null, 2), (err) => {
                if(err) {
                    console.log(err);
                    res.status(500).send('Error Reading Data');
                    return;
                }
                res.redirect('/');
            });
        } else {
            res.status(404).send('Blog not found')
        }
    });
});


// Route to delete a blog
app.delete('/blog/delete/:id', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error Reading Data');
            return;
        }
        let blogresults = JSON.parse(data);
        blogresults = blogresults.filter(blogresult => blogresult.id !== parseInt(req.params.id));

        fs.writeFile('data.json', JSON.stringify(blogresults, null, 2), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error Writing Data');
                return;
            }
            res.status(200).send({ message: 'Blog deleted' });
        });
    });
});


//Route for 404
app.use((req, res) => {
    res.status(404).render('404', { title: 404 });
});

app.listen(4000);