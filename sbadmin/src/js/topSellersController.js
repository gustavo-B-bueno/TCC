app.controller('topSellersController', function($scope, config, $ngConfirm) {
    let module = 'topSellers';

    $scope.grid = [];

    fetch(config.apiUrl + module)
    .then(response => response.json())
    .then(data => {
        $scope.grid = data;
        $scope.$apply();
    })
    .catch(error => console.error('Erro ao buscar vendedor que mais vendeu:', error));

    // Função para gerar o PDF dos vendedores com mais vendas
    $scope.downloadTopSellersPDF = function() {
        fetch(config.apiUrl + 'topSellersPDF', { // Ajuste para chamar o endpoint de PDF se já estiver implementado
            method: 'GET',
            headers: {
                "Accept": "application/pdf"
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
            a.download = 'relatorio-top-sellers.pdf'; // Nome do arquivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Libera o recurso
        })
        .catch(error => {
            console.error('Erro ao gerar o PDF:', error);
            alert('Erro ao gerar o PDF. Tente novamente.');
        });
    };

    
});
