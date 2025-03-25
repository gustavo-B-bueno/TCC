app.controller('ConsumerController', function($scope, config, $ngConfirm, $http) {

    let module = 'consumer';

    $scope.grid = [];

    fetch(config.apiUrl + module)
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
            $scope.forms.rua = data.logradouro
            $scope.forms.complemento = data.complemento
            $scope.forms.bairro = data.bairro
            $scope.forms.cidade = data.localidade
            $scope.forms.uf = data.uf
        })
        .catch(() => {
            alert('ERROR')
        })
    }
    //end

    $scope.modal = function(data){
        
        if(data){
            $scope.forms = data;
        } else {
            $scope.forms = {status: 1};
        }

        let method = (data == null) ? 'POST' : 'PUT';
        let url = (data == null) ? config.apiUrl+module : config.apiUrl+module+'/'+data.id;

            $ngConfirm({
                title: 'Editar',
                contentUrl: './pages/'+module+'/form.html',
                scope: $scope,
                theme: 'light',
                typeAnimated: true,
                closeAnimation: 'scale',
                columnClass: 'xlarge',
                backgroundDismiss: false,
                closeIcon: true,
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
                                body: JSON.stringify($scope.forms)
                            })
                            .then(response => response.json())
                            .then(rs => {

                                if(rs.errors){
                                    $scope.msg = (rs.errors[0]) ? rs.errors[0].msg : rs.errors.msg;
                                    $scope.alert = 'alert-danger';
                                } else {
                                    $scope.msg = 'Cadastro realizado com sucesso';
                                    $scope.alert = 'alert-success';

                                    setTimeout(() => {
                                        //window.location.reload();
                                    }, 2000)
                                }

                                $scope.$apply();
                                window.location.reload(); // Recarrega a pagina

                            })
                            .catch(() => {
                                alert('ERROR')
                            })

                            return false;

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

