app.controller('mostSoldProductsController', function($scope, config, $ngConfirm) {
    let module = 'mostSoldProducts';

    $scope.grid = [];

    fetch(config.apiUrl + module)
    .then(response => response.json())
    .then(data => {
        $scope.grid = data;
        $scope.$apply();
    })
    .catch(error => console.error('Erro ao buscar os produtos mais vendidos:', error));

    // Função para gerar o PDF dos produtos mais vendidos
    $scope.downloadMostSoldProductsPDF = function() {
        fetch(config.apiUrl + 'mostSoldProductsPDF', {
            method: 'GET',
            headers: {
                "Accept": "application/pdf" // Especifica que estamos esperando um PDF como resposta
            }
        })
        .then(response => {
            if (response.status === 200) {
                return response.blob(); // Converte o PDF recebido para um Blob
            } else {
                throw new Error('Erro ao gerar o PDF');
            }
        })
        .then(blob => {
            // Cria um link para download do PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio-produtos-mais-vendidos.pdf'; // Nome do arquivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Libera o recurso
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao gerar o PDF. Tente novamente.');
        });
    };
});
