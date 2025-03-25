app.controller('VendaController', function($scope, config, $ngConfirm) {
    let module = 'venda';

    $scope.users = [];
    $scope.clientes = null;
    $scope.produtos = null;

    fetch(config.apiUrl + 'users')
    .then(rs => rs.json())
    .then(rs => {
        $scope.users = rs;
    });

    fetch(config.apiUrl + 'consumer')
    .then(rs => rs.json())
    .then(rs => {
        $scope.clientes = rs;
    });

    fetch(config.apiUrl + 'product')
    .then(rs => rs.json())
    .then(rs => {
        $scope.produtos = rs;
    });

    fetch(config.apiUrl + module)
    .then(rs => rs.json())
    .then(rs => {
        $scope.grid = rs;
        $scope.$apply();
    });

    $scope.updatePrecoProduto = function() {
        let selectedProduct = $scope.produtos.find(product => product.name === $scope.venda.nomeProduto);
        $scope.venda.precoProduto = selectedProduct ? selectedProduct.price : '';
    };

    $scope.modal = function(data) {
        $scope.venda = data || {status: 1};
        let method = (data == null) ? 'POST' : 'PUT';
        let url = (data == null) ? config.apiUrl + module : config.apiUrl + module + '/' + data.id;

        $ngConfirm({
            title: 'Editar',
            contentUrl: './pages/' + module + '/form.html',
            scope: $scope,
            theme: 'light',
            typeAnimated: true,
            closeAnimation: 'scale',
            columnClass: 'large',
            backgroundDismiss: false,
            closeIcon: true,
            buttons: {
                save: {
                    text: 'Salvar',
                    btnClass: 'btn-green',
                    action: function() {
                        const data = {
                            nomeVendedor: $scope.venda.nomeVendedor,
                            nomeCliente: $scope.venda.nomeCliente,
                            nomeProduto: $scope.venda.nomeProduto,
                            total: $scope.venda.precoProduto
                        };

                        fetch(url, {
                            method: method,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(rs => {
                            if(rs.error) {
                                $scope.msg = rs.error;
                                $scope.alert = 'alert-danger';
                            } else {
                                $scope.msg = 'Cadastro realizado com sucesso';
                                $scope.alert = 'alert-success';

                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            }

                            $scope.$apply();
                        })
                        .catch(() => {
                            alert('ERROR');
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

    $scope.del = function(id){
        $ngConfirm({
            title: 'Atenção',
            content: 'Tem certeza que deseja remover este registro',
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
                    action: function(){

                        fetch( config.apiUrl+module+'/'+id, {
                            method: 'DELETE',
                            headers:{
                                "Content-Type":"application/json",
                                "Accept":"application/json"
                            }
                        })
                        .then(response => response.json())
                        .then(rs => {
                            setTimeout(() => {
                                window.location.reload();
                            },1000)
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
});
