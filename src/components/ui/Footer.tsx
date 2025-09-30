"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logobranca.svg"
                alt="CRC Faróis"
                width={200}
                height={73}
                className="h-12 w-auto"
              />
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Há mais de 3 anos no mercado, especializada em faróis automotivos
              e lanternas traseiras com produtos de alta qualidade e excelência
              no atendimento.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-yellow-300 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/quem-somos"
                  className="text-gray-300 hover:text-yellow-300 transition-colors"
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-300 hover:text-yellow-300 transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Faróis Automotivos</li>
              <li className="text-gray-300">Lanternas Traseiras</li>
              <li className="text-gray-300">Grade Frontal</li>
              <li className="text-gray-300">Farol de Milha</li>
              <li className="text-gray-300">Acessórios em Geral</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>São André - SP</p>
                  <p>ABC Paulista</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">(11) 99226-8645</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  contato@crc.ind.br
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-primary mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Seg - Qui: 8h às 17h</p>
                  <p>Sex: 8h às 16h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 CRC Faróis. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/politica-privacidade"
                className="text-gray-400 hover:text-yellow-300 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos-uso"
                className="text-gray-400 hover:text-yellow-300 transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
