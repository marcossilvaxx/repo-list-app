import api from './api';

class App{
    constructor(){
        this.repositories = [];
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');
        this.registerHandlers();
    }

    registerHandlers(){
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true){
        if(loading){
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Loading...'));
            loadingEl.id = 'loading';

            this.formEl.appendChild(loadingEl);
        }else{
            this.formEl.removeChild(document.getElementById('loading'));
        }
    }

    async addRepository(event){
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput.length === 0){
            return;
        }

        try{
            this.setLoading();
            const response = await api.get(`/repos/${repoInput}`);

            const {name, description, html_url, owner: { avatar_url }} = response.data;

            this.repositories.push({
                name,
                description,
                html_url,
                avatar_url
            });

            this.inputEl.value = '';

            this.renderRepositories();

        }catch (err){
            alert('Repository not found');
        }

        this.setLoading(false);

    }

    renderRepositories(){
        this.listEl.innerHTML= "";

        this.repositories.forEach(repo => {

            let repoEl = document.createElement('li');

            let img = document.createElement('img');
            img.src = repo.avatar_url;
            let repoName = document.createElement('strong');
            repoName.innerText = repo.name;
            let repoDescription = document.createElement('p');
            repoDescription.innerText = repo.description;
            let repoLink = document.createElement('a');
            repoLink.target = '_blank';
            repoLink.href = repo.html_url;
            repoLink.innerText = 'Acessar';

            repoEl.appendChild(img);
            repoEl.appendChild(repoName);
            repoEl.appendChild(repoDescription);
            repoEl.appendChild(repoLink);

            this.listEl.appendChild(repoEl);
        })
    }
}

new App();