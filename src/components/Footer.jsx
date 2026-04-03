import React from 'react';
import { Mail, Link, MapPin, ExternalLink, Copyright } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section main-info">
                    <h3 className="footer-logo">UniMarket BUAP</h3>
                    <p className="developer-name">Desarrollado por <span>Herson Javier Urdiales de la Cruz</span></p>
                    <div className="location-info">
                        <MapPin size={16} />
                        <span>Puebla, México</span>
                    </div>
                </div>

                <div className="footer-section links">
                    <h4>Legales</h4>
                    <ul>
                        <li><a href="#terms">Términos y Condiciones</a></li>
                        <li><a href="#privacy">Aviso de Privacidad</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Contacto</h4>
                    <div className="social-icons">
                        <a href="#" className="social-link" title="Instagram"><Link size={20} /></a>
                        <a href="https://github.com" className="social-link" title="GitHub"><ExternalLink size={20} /></a>
                        <a href="mailto:contact@unimarket.com" className="social-link" title="Email"><Mail size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    <Copyright size={14} />
                    <span>{currentYear} UniMarket BUAP. Todos los derechos reservados.</span>
                </div>
                <div className="footer-tagline">
                    Hecho para la comunidad BUAP
                </div>
            </div>
        </footer>
    );
};

export default Footer;
