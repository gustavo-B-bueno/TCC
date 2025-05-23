app.controller('UserController',function(config, $scope, $http, $ngConfirm){
    let module = 'user';

    $scope.grid = [];

    fetch(config.apiUrl + 'users')
    .then(rs => rs.json())
    .then(rs => {
        $scope.grid = rs;
        $scope.$apply();
    })

    //buscar cep na api via cep
    $scope.getCep = function(cep){
        let url = 'https://viacep.com.br/ws/'+cep+'/json/';
        $http.get(url)
        .then((rs) => {
            let data = rs.data;
            $scope.pessoa.rua = data.logradouro
            $scope.pessoa.complemento = data.complemento
            $scope.pessoa.bairro = data.bairro
            $scope.pessoa.cidade = data.localidade
            $scope.pessoa.uf = data.uf
        })
        .catch(() => {
            alert('ERROR')
        })
    }
    //end

    $scope.modal = function(data){
    
        $scope.pessoa = data;
        let method = (data == null) ? 'POST' : 'PUT';
        let url = (data == null) ? config.apiUrl+'user' : config.apiUrl+'user/'+data.id;
        
        $ngConfirm({
            title: 'Editar',
            contentUrl: './pages/user/form.html',
            scope: $scope,
            theme: 'light',
            typeAnimated: true,
            closeAnimation: 'scale',
            columnClass: 'xlarge',
            buttons: {
                save: {
                    text: 'Salvar',
                    btnClass: 'btn-green',
                    action: function(){
                        fetch(url, {
                            method: method,
                            headers:{
                                "Content-Type":"application/json",
                                "Accept":"application/json"
                            },
                            body: JSON.stringify($scope.pessoa)
                        })
                        .then(response => response.json())
                        .then(rs => {
                            $ngConfirm({
                                title: config.name,
                                content: rs.msg

                            })
                            window.location.reload(); // Recarrega a pagina
                        })
                        .catch(() => {
                            alert('ERROR')
                        })
                    }
                },
                cancel: {
                    text: 'Cancelar',
                    btnClass: 'btn-red'
                }
            }
        })
    }

    $scope.del = function(id) {
        $ngConfirm({
            title: 'Atenção',
            content: 'Tem certeza que deseja remover este registro?',
            scope: $scope,
            type: 'red',
            theme: 'light',
            typeAnimated: true,
            closeAnimation: 'scale',
            columnClass: 'small',
            backgroundDismiss: false,
            closeIcon: true,
            buttons: {
                save: {
                    text: 'Confirmar',
                    btnClass: 'btn-green',
                    action: function() {
                        fetch(config.apiUrl + module + '/' + id, {
                            method: 'DELETE',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            }
                        })
                        .then(response => {
                            // Verifica se a resposta é 204 (No Content)
                            if (response.status === 204) {
                                console.log('Registro deletado com sucesso');
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                                return;
                            }
                            return response.json(); // Processa o JSON apenas se houver corpo
                        })
                        .then(rs => {
                            if (rs) {
                                console.log('Registro deletado:', rs);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao deletar o registro:', error);
                        });
                    }
                },
                cancel: {
                    text: 'Cancelar',
                    btnClass: 'btn-red'
                }
            }
        });
    };

});