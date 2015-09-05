var Rest = {
    getInitialState: function() {
		return {data: [], loading: 0 };
	},
    loadDataApiService: function() {
		$.ajax({
			url: 'http://antonioyee.mx/quiniela-app/api/service/pronosticos/clave/' + this.props.token,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.token, status, err.toString());
			}.bind(this)
		});
	},
    componentDidMount: function() {
        var mas = 0;
        while ( mas < 100 ) {
            this.setState({loading: mas++});
        }
        this.loadDataApiService();
	},
};

var App = React.createClass({
    mixins: [Rest],
    render(){
        if ( this.state.data.length == 0 ) {
            return (
                <div className="progress">
                    <div id="progreso-login" className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.loading + "%" }}>
                        <span className="sr-only"></span>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <Header configuracion={this.state.data.configuracion} />
                    <PanelJugadores jugadores={this.state.data.jugadores} resumen={this.state.data.resumen} pronosticos={this.state.data.pronosticos} />
                </div>
            )
        }

    }
});

var Header = React.createClass({
    render(){
        var config = this.props.configuracion

        if (config) {
            var liga = (config.liga).toUpperCase();
            var torneo = config.torneo;
            var jornada = (config.jornada).toUpperCase();;
            var logo = config.logo;
        }

        return(
            <div className="row text-center">
                <div className="col-sm-2 text-center">
                    <img src={'http://antonioyee.mx/quiniela-app/logos/mini/' + logo} alt=""></img>
                </div>
                <div className="col-sm-8 text-center">
                    <span className="lead">{liga}</span><br></br>
                    <span className="lead">{torneo}</span><br></br>
                    <span className="lead">{jornada}</span><br></br>
                </div>
            </div>
        )
    }
});

var PanelJugadores = React.createClass({
    render(){
        var pronosticos = this.props.pronosticos;
        var resumen         = this.props.resumen;
        var jugadorResumen  = [];

        if ( this.props.jugadores ) {

            var jugador = this.props.jugadores.map(function (campo, item) {

                if ( resumen ) {
                    resumen.map(function (jugador, item) {
                        if ( campo.id_jugador == jugador.JugadorID ) {
                            jugadorResumen = jugador;
                        }
                    });
                }

                return (
                    <div className="col-sm-12 col-md-6">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title">{campo.nombre}</h3>
                            </div>
                            <Resumen jugadorResumen={jugadorResumen} />
                            <Tabla dataPronosticos={pronosticos} id_jugador={campo.id_jugador} />
                        </div>
                    </div>
                )
            });
        }

        return(
            <div className="row">
                {jugador}
            </div>
        )
    }
});

var Resumen = React.createClass({
    render(){
        return(
            <div className="panel-body">
                <div className="row">
                    <div className="col-xs-3 col-sm-2 col-md-4">
                        <div className="panel panel-success">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <span className="visible-xs visible-sm"><span className="label label-success"><span className="glyphicon glyphicon-thumbs-up"></span></span></span>
                                    <span className="hidden-xs hidden-sm">Aciertos <span className="label label-success"><span className="glyphicon glyphicon-thumbs-up"></span></span></span>
                                </h3>
                            </div>
                            <div className="panel-body" style={{'text-align':"center"}}><span className="lead">{this.props.jugadorResumen.aciertos}</span></div>
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-2 col-md-4">
                        <div className="panel panel-danger">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <span className="visible-xs visible-sm"><span className="label label-danger"><span className="glyphicon glyphicon-thumbs-down"></span></span></span>
                                    <span className="hidden-xs hidden-sm">Errores <span className="label label-danger"><span className="glyphicon glyphicon-thumbs-down"></span></span></span>
                                </h3>
                            </div>
                            <div className="panel-body" style={{'text-align':"center"}}><span className="lead">{this.props.jugadorResumen.errores}</span></div>
                        </div>
                    </div>
                    <div className="col-xs-6 col-sm-8 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title">Pronosticaste</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-4 col-md-12">
                                        <span className="badge">{this.props.jugadorResumen.locales}</span> LOCALES
                                    </div>
                                    <div className="col-sm-4 col-md-12">
                                        <span className="badge">{this.props.jugadorResumen.empates}</span> EMPATES
                                    </div>
                                    <div className="col-sm-4 col-md-12">
                                        <span className="badge">{this.props.jugadorResumen.visitas}</span> VISITAS
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var Tabla =  React.createClass({
    render: function () {
        var pronosticador   = this.props.id_jugador;
        var pronosticos     = this.props.dataPronosticos;
        var dataPronosticos = [];

        if ( pronosticos ) {
            pronosticos.map(function (pnt, item) {
                if ( pronosticador == pnt.id_jugador ) {
                    dataPronosticos.push(pnt)
                }
            });
        }

        return (
            <table className="table table-hover table-condensed" >
                <thead>
                    <tr>
                        <th><span className="pull-left hidden-xs">PRONOSTICO</span></th>
                        <th><span className="pull-left"><span className="hidden-xs">LOCAL</span><span className="visible-xs">LOC</span></span></th>
                        <th style={{'text-align':"center"}}><span className="hidden-xs"></span></th>
                        <th className="text-right"><span className="text-right"><span className="hidden-xs">VISITA</span><span className="visible-xs">VIS</span></span></th>
                    </tr>
                </thead>
                <JuegosPronosticados calendario={dataPronosticos} />
            </table>
        )
    },
});

var JuegosPronosticados = React.createClass({
    render: function () {
        var fecha_larga = null;
        var juegos = this.props.calendario.map(function(data, index) {
            if ( fecha_larga != data.fecha_larga ) {
                fecha_larga = data.fecha_larga;
                return <div key={data.id_juego}>
                            <FechaJuego fecha_larga={data.fecha_larga} />
                            <RegistroJuego hora={data.hora} logo_local={data.logo_local} logo_visita={data.logo_visita}
                                id_local={data.id_local} id_visita={data.id_visita} id_juego={data.id_juego} id_torneo={data.id_torneo}
                                goles_local={data.goles_local} goles_visita={data.goles_visita}
                                pronosticaste={data.pronostico} resultado={data.resultado} />
                        </div>
            }
            return <RegistroJuego key={data.id_juego} hora={data.hora} logo_local={data.logo_local} logo_visita={data.logo_visita}
                id_local={data.id_local} id_visita={data.id_visita} id_juego={data.id_juego} id_torneo={data.id_torneo}
                goles_local={data.goles_local} goles_visita={data.goles_visita}
                pronosticaste={data.pronostico} resultado={data.resultado} />
        });

        return(
            <tbody>
                {juegos}
            </tbody>
        )
    },
});

var FechaJuego =  React.createClass({
    render: function () {
        return (
            <tr>
                <td colSpan={'4'}><small><b>{this.props.fecha_larga}</b></small></td>
            </tr>
        )
    },
});

var RegistroJuego =  React.createClass({
    render: function () {
        return (
            <tr>
                <td>
                    <ResultadoPronostico pronosticaste={this.props.pronosticaste} resultado={this.props.resultado} />
                </td>
                <td>
                    <div className="row">
                        <div className="col-xs-6 col-sm-8">
                            <LogoImg style={{height: '35px', width: '35px'}} url={ 'http://antonioyee.mx/quiniela-app/logos/mini/' + this.props.logo_local } class={'img-thumbnail img-responsive'} />
                        </div>
                        <div className="col-xs-6 col-sm-3">
                            <Marcador tipo={'local'} goles_local={this.props.goles_local} goles_visita={this.props.goles_visita} sizeH={'h4'} />
                        </div>
                    </div>
                </td>
                <td className="text-center">vs.</td>
                <td>
                    <div className="row">
                        <Marcador tipo={'visita'} goles_local={this.props.goles_local} goles_visita={this.props.goles_visita} sizeH={'h4'} />
                        <div className="col-xs-6 col-sm-8">
                            <span className="pull-right">
                                <LogoImg style={{height: '35px', width: '35px'}} url={ 'http://antonioyee.mx/quiniela-app/logos/mini/' + this.props.logo_visita } class={'img-thumbnail img-responsive pull-right'} />
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        )
    },
});

var ResultadoPronostico = React.createClass({
    render: function () {
        if ( this.props.pronosticaste == this.props.resultado ) {
            if ( this.props.resultado == 'SIN MARCADOR' ) {
                labelResultado = <span className="label label-info">{this.props.pronosticaste}</span>
            }else{
                labelResultado = <div>
                                    <span className="hidden-xs">
                                        <span className="label label-success">
                                            <span className="glyphicon glyphicon-thumbs-up"></span>
                                        </span>
                                        &nbsp;<b>{this.props.pronosticaste}</b>
                                    </span>
                                    <span className="visible-xs">
                                        <span className="label label-success">{this.props.pronosticaste}</span>
                                    </span>
                                </div>
            }
        }else{
            if ( this.props.resultado == 'SIN MARCADOR' ) {
                labelResultado = <span className="label label-info">{this.props.pronosticaste}</span>
            }else{
                labelResultado = <div>
                                    <span className="hidden-xs">
                                        <span className="label label-danger">
                                            <span className="glyphicon glyphicon-thumbs-down"></span>
                                        </span>
                                        &nbsp;<b>{this.props.pronosticaste}</b>
                                    </span>
                                    <span className="visible-xs">
                                        <span className="label label-danger">{this.props.pronosticaste}</span>
                                    </span>
                                </div>
            }
        }
        return (
            <div>{labelResultado}</div>
        );
    },
});

var LogoImg = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        url: React.PropTypes.string.isRequired,
        class: React.PropTypes.string
    },
    render: function(){
        return (
            <img style={this.props.style} src={this.props.url} className={this.props.class} />
        )
    }
});

var Marcador = React.createClass({
    render: function () {
        if ( this.props.ganador != 'SIN MARCADOR' ) {
            if ( this.props.tipo == 'local' ) {
                if (this.props.goles_local > this.props.goles_visita ) {
                    var clase = 'label-success';
                }else{
                    if ( this.props.goles_local < this.props.goles_visita ) {
                        var clase = 'label-danger';
                    }else{
                        var clase = 'label-primary';
                    }
                }
                var goles = this.props.goles_local;
            }else{
                if (this.props.goles_local > this.props.goles_visita ) {
                    var clase = 'label-danger';
                }else{
                    if ( this.props.goles_local < this.props.goles_visita ) {
                        var clase = 'label-success';
                    }else{
                        var clase = 'label-primary';
                    }
                }
                var goles = this.props.goles_visita;
            }
            var marcador = <span className={'label ' + clase }>{goles}</span>;
        }else{
            var marcador = '';
        }

        switch ( this.props.sizeH ) {
            case 'h4':  var title = <h4 style={{'margin-top': '2px'}}>{marcador}</h4>; break;
            default:    var title = <h3>{marcador}</h3>; break;
        }

        return(
            <div className="col-xs-6 col-sm-3">
                <div class="form-group">
                    {title}
                </div>
            </div>
        )
    },
});

var token = $('#token').val();

React.render(<App token={token} />, document.getElementById('contenedor-principal'));
