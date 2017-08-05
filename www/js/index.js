function getCaminho(){
	return "http://192.168.0.103/Estudo/PhoneGap/CEST_NCM/Servidor/ajax/";
}

function aviso(codigo_aviso){
	if (codigo_aviso == 1) {
		if (confirm("Deseja realmente LIMPAR a tabela de NCM para inserir novos dados?") == true) {
			//aqui vai uma funcao para deletar tudo
			deltaNCM();
		}
	}
	if (codigo_aviso == 2) {
		if (confirm("Deseja importar novos NCMs?") == true) {
			//aqui vai uma funcao para importar
			importaNCM();
		}
	}
}
function deltaNCM() {
	var caminho = getCaminho() + 'deleta_ncm.ajax.php';
	$.getJSON(caminho,{
		ajax: 'true',
	}, 
	function(j){
		if (j[0].resultado) {
			alert('NCMs deletados com sucesso.');
		}else{
			alert('Erro ao deletar NCMs.');
		}
	});
}
function importaNCM() {

	var caminho = getCaminho() + 'importa_ncm.ajax.php';
	$.getJSON(caminho,
	function(j){
		if (j[0].resultado) {
			captura_ncm();
			alert('Processo de importação finalizado.');
		}else{
			alert('Erro na importação NCMs.');
		}
	});
}

function captura_ncm() {

	var caminho = getCaminho() + 'captura_ncm.ajax.php';
    $.getJSON(caminho, function(result) {
        console.log(result);
		var tabela = '';
        var i = 0;

		tabela = '\n<tr>';
		tabela += '\n	<th>#</th>';
		tabela += '\n	<th>ID</th>';
		tabela += '\n	<th>NCM</th>';
		tabela += '\n	<th>Tam.</th>';
		tabela += '\n	<th>DESCRIÇÃO NCM</th>';
		tabela += '\n	<th>QTD REGISTRO</th>';
		tabela += '\n	<th>CNPJ</th>';
		tabela += '\n	<th>!</th>';
		tabela += '\n</tr>'; 
        $("#tabela_ncm").append(tabela);
        
        $.each(result, function(i, field) {
            var ID_NCM        = field.ID_NCM;
            var NCM           = field.NCM;
            var DESCRICAO_NCM = field.DESCRICAO_NCM;
            var QTD_REGISTRO  = field.QTD_REGISTRO;
            var AJUSTADO      = field.AJUSTADO;
            var CPF_CNPJ      = field.CPF_CNPJ;
            var registro      = '';

			registro += '<tr>';
			registro += '	<td>'+(i++)+'</td>';
			registro += '	<td>'+field.ID_NCM+'</td>';
			registro += '	<td>'+field.NCM+'</td>';
			registro += '	<td>'+field.NCM.length+'</td>';
			registro += '	<td>'+field.DESCRICAO_NCM+'</td>';
			registro += '	<td>'+field.QTD_REGISTRO+'</td>';
			registro += '	<td>'+field.CPF_CNPJ+'</td>';

			if (field.AJUSTADO == 'S'){
				registro += '	<td><button data-toggle="modal" data-target=".bs-example-modal-lg" class="btn btn-success">Ajuste</button></td>';
			}else{
				registro += '	<td><button id="'+field.ID_NCM+'" name="'+field.NCM+'" onclick="verificaNCM(id,name)" data-toggle="modal" data-target=".bs-example-modal-lg" class="btn btn-danger">Ajuste</button></td>';
			}
			registro += '</tr>';
            
            $("#tabela_ncm").append(registro);
        });
    });
}

function verificaNCM(id_ncm,NCM){

	var caminho = getCaminho() + 'verifica_ncm.ajax.php';
	$.getJSON(caminho,{
		NCM: NCM,
	},
	function(j){
		var tabela = '';
		var tr = '';

		tabela = '\n<tr>';
		tabela += '\n	<th>ID</th>';
		tabela += '\n	<th>NCM</th>';
		tabela += '\n	<th>QTD Caracter NCM</th>';
		tabela += '\n	<th>CEST</th>';
		tabela += '\n	<th>DESCRIÇÃO</th>';
		tabela += '\n	<th>SEGMENTO</th>';
		tabela += '\n	<th>!</th>';
		tabela += '\n</tr>'; 
		for (var i = 0; i < j.length; i++) {
			tr += '\n<tr>';
			tr += '\n	<td>'+j[i].ID_CEST+'</td>';
			tr += '\n	<td>'+j[i].NCM+'</td>';
			tr += '\n	<td>'+j[i].NCM.length+'</td>';
			tr += '\n	<td>'+j[i].CEST+'</td>';
			tr += '\n	<td>'+j[i].DESCRICAO+'</td>';
			tr += '\n	<td>'+j[i].SEGMENTO+'</td>';
			tr += '\n	<td><button id="'+id_ncm+'" name="'+j[i].CEST+'" onclick="ajustaNCM(id,name)" type="button" class="btn btn-warning">Atualizar</button></td>';
			tr += '\n</tr>';
		}
		var concatena;
		concatena = tabela + tr;
		document.getElementById('nomeNCM').innerHTML = 'NCM: '+NCM;
		document.getElementById('descricaoNCM').innerHTML = 'Descrição: '+ j[0].DESCRICAO_NCM;
		document.getElementById('resultado_ncm').innerHTML = concatena;
	});
}

function ajustaNCM(id_ncm,cest) {
	
	var caminho = getCaminho() + 'ajusta_ncm.ajax.php';
	$.getJSON(caminho,{
		ID_NCM: id_ncm,
		CEST: cest,
	},function(j){
		if (j[0].resultado){
			$('#'+id_ncm).removeClass("btn-danger");
			$('#'+id_ncm).addClass("btn-success");
			$('#myModal').modal('hide');
		}else{
			alert('Erro ao fazer ajuste ID_NCM: '+id_ncm);
		}
		captura_ncm();
	});
}

function arrumaNCM() {

	var caminho = getCaminho() + 'arruma_ncm.ajax.php';
	$.getJSON(caminho,
	function(j){
		if (j[0].resultado){
			alert('NCMs ajustados com sucesso!');
		}else{
			alert('Erro ao fazer ajustar NCMs');
		}
	});
}

function listarUpdate() {

	var caminho = getCaminho() + 'gerar_scripts.ajax.php';
	$.getJSON(caminho,
	function(j){
		var tabela_update = '';
		document.getElementById('descricao_tabela').innerHTML = 'Listagem de Updates';
		tabela_update = '<tr><th>UPDATE</th></tr>';

		for (var i = 0; i < j.length; i++) {
			tabela_update += '<tr>';
			tabela_update += '	<td>'+j[i].UPDATE+'</td>';
			tabela_update += '</tr>';
		}
		document.getElementById('tabela_update').innerHTML = tabela_update;
	});
}
function listarScriptCEST() {

	var caminho = getCaminho() + 'gerarScriptCEST.ajax.php';
	$.getJSON(caminho,
	function(j){
		var tabela_update = '';
		document.getElementById('descricao_tabela').innerHTML = 'Listagem de CESTs';
		tabela_update = '<tr><th>UPDATE</th></tr>';

		for (var i = 0; i < j.length; i++) {
			tabela_update += '<tr>';
			tabela_update += '	<td>'+j[i].UPDATE+'</td>';
			tabela_update += '</tr>';
		}
		document.getElementById('tabela_update').innerHTML = tabela_update;
		document.getElementById('painel_cest').style.display = 'table';
		document.getElementById('cria_tbl_cest').innerHTML = '<p style="color:red"><b>CREATE TABLE TBL_CEST ( <br> &nbsp;&nbsp;&nbsp;&nbsp;CEST VARCHAR(7) NOT NULL,<br> &nbsp;&nbsp;&nbsp;&nbsp;NCM VARCHAR(8),<br> &nbsp;&nbsp;&nbsp;&nbsp;DESCRICAO VARCHAR(512) <br>);</b></p>';
	});
}

function gerarScriptCorrecao() {

	var caminho = getCaminho() + 'gerar_scripts_correcao.ajax.php';
	$.getJSON(caminho,
	function(j){
		var tabela_update = '';
		document.getElementById('descricao_tabela').innerHTML = 'Listagem de Updates';
		tabela_update = '<tr><th>UPDATE</th></tr>';

		if (j.length > 0) {
			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="update_cest_null">UPDATE TBL_PRODUTO SET CEST = NULL;</td>';
			tabela_update += '</tr>';			
		}

		for (var i = 0; i < j.length; i++) {
			tabela_update += '<tr>';
			tabela_update += '	<td>'+j[i].UPDATE+'</td>';
			tabela_update += '</tr>';
		}

		if (j.length > 0) {

			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="update_cod_trib_17">UPDATE TBL_PRODUTO SET CODIGO_TRIBUTACAO = \'17\', COBRANCA_ICMS_ST = \'N\';</td>';
			tabela_update += '</tr>';
			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="update_cod_trib_ff">UPDATE TBL_PRODUTO SET CODIGO_TRIBUTACAO = \'FF\', COBRANCA_ICMS_ST = \'S\' WHERE CEST IS NOT NULL;</td>';
			tabela_update += '</tr>';
			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="deleta_trib">DELETE FROM TBL_TRIBUTACAO;</td>';
			tabela_update += '</tr>';
			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="insert_cod_trib_ff">INSERT INTO TBL_TRIBUTACAO (ID_ITEM, ID_PRODUTO, UF, ICMS_PER, IPI_PER, STR, ID_EMPRESA, MOD_BC_ICMS, ICMS_BASE_CAL, PER_RED_BASE_ICMS, STR_IPI, STR_PIS, PIS_TP_CALCULO, PIS_ST_TP_CALCULO, STR_COFINS, COFINS_TP_CALCULO, COFINS_ST_TP_CALCULO, CST_ICMS_NAO_CONTRIB_NA_ST) SELECT ID_PRODUTO , ID_PRODUTO, \'MS\', 0, 0, \'500\', 1, 4, 0, 0, \'99\', \'99\', 0, 0, \'99\', 0, 0, \'500\' FROM TBL_PRODUTO WHERE CODIGO_TRIBUTACAO = \'FF\';</td>';
			tabela_update += '</tr>';
			tabela_update += '<tr>';
			tabela_update += '	<td class="vermelho" id="insert_cod_trib_17">INSERT INTO TBL_TRIBUTACAO (ID_ITEM, ID_PRODUTO, UF, ICMS_PER, IPI_PER, STR, ID_EMPRESA, MOD_BC_ICMS, ICMS_BASE_CAL, PER_RED_BASE_ICMS, STR_IPI, STR_PIS, PIS_TP_CALCULO, PIS_ST_TP_CALCULO, STR_COFINS, COFINS_TP_CALCULO, COFINS_ST_TP_CALCULO, CST_ICMS_NAO_CONTRIB_NA_ST) SELECT ID_PRODUTO , ID_PRODUTO, \'MS\', 0, 0, \'101\', 1, 4, 0, 0, \'99\', \'99\', 0, 0, \'99\', 0, 0, \'102\' FROM TBL_PRODUTO WHERE CODIGO_TRIBUTACAO = \'17\';</td>';
			tabela_update += '</tr>';
		}
		$('#tabela_update').append = tabela_update;
		$('#update_cest_null').style.color = "red";
		$('#update_cod_trib_17').style.color = "red";
		$('#update_cod_trib_ff').style.color = "red";
		$('#deleta_trib').style.color = "red";
		$('#insert_cod_trib_ff').style.color = "red";
		$('#insert_cod_trib_17').style.color = "red";

	});
}