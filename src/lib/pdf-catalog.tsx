import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Registrar fontes (opcional - pode usar as default do PDF)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
// });

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: "3px solid #2b308c",
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2b308c",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 5,
  },
  sectionHeader: {
    backgroundColor: "#2b308c",
    padding: 12,
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    border: "1px solid #e0e0e0",
  },
  productImage: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 4,
    marginRight: 15,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  productSku: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  productStatus: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  statusAvailable: {
    backgroundColor: "#10b981",
    color: "#ffffff",
  },
  statusUnavailable: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1px solid #e0e0e0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#666666",
  },
  footerText: {
    fontSize: 9,
    color: "#666666",
  },
  pageNumber: {
    fontSize: 9,
    color: "#666666",
  },
  emptySection: {
    fontSize: 10,
    color: "#999999",
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 10,
  },
});

interface Product {
  id: string;
  titulo: string;
  sku: string;
  origem: string | null;
  imagemPrincipal: string | null;
  ativo: boolean;
}

interface CatalogPDFProps {
  products: Product[];
  logoUrl?: string;
}

// Agrupar produtos por origem
const groupByOrigin = (products: Product[]) => {
  const groups: { [key: string]: Product[] } = {};

  products.forEach((product) => {
    const origin = product.origem || "Outros";
    if (!groups[origin]) {
      groups[origin] = [];
    }
    groups[origin].push(product);
  });

  // Ordenar as origens por prioridade
  const priorityOrder = ["EXCLUSIVO", "IMPORTADO", "NACIONAL", "OUTROS"];
  const sortedGroups: { [key: string]: Product[] } = {};

  priorityOrder.forEach((origin) => {
    const key = Object.keys(groups).find((k) => k.toUpperCase() === origin);
    if (key) {
      sortedGroups[key] = groups[key];
    }
  });

  // Adicionar origens que não estão na lista de prioridade
  Object.keys(groups).forEach((origin) => {
    if (!sortedGroups[origin]) {
      sortedGroups[origin] = groups[origin];
    }
  });

  return sortedGroups;
};

const CatalogPDF: React.FC<CatalogPDFProps> = ({ products, logoUrl }) => {
  const groupedProducts = groupByOrigin(products);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            {logoUrl ? (
              <Image src={logoUrl} style={styles.logo} />
            ) : (
              <Text
                style={{ fontSize: 18, color: "#2b308c", fontWeight: "bold" }}
              >
                CRC FARÓIS
              </Text>
            )}
            <Text style={styles.headerTitle}>CATÁLOGO 2025</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Faróis e Lanternas Automotivos - Qualidade e Confiança
          </Text>
        </View>

        {/* Produtos agrupados por origem */}
        {Object.entries(groupedProducts).map(([origin, prods], index) => (
          <View key={origin} wrap={false}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {origin.toUpperCase()} ({prods.length}{" "}
                {prods.length === 1 ? "produto" : "produtos"})
              </Text>
            </View>

            {/* Products in this section */}
            {prods.length === 0 ? (
              <Text style={styles.emptySection}>
                Nenhum produto nesta categoria
              </Text>
            ) : (
              prods.map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  {/* Product Image */}
                  {product.imagemPrincipal ? (
                    <Image
                      src={product.imagemPrincipal}
                      style={styles.productImage}
                    />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Text style={{ fontSize: 8, color: "#999" }}>
                        Sem imagem
                      </Text>
                    </View>
                  )}

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.titulo}</Text>
                    <Text style={styles.productSku}>SKU: {product.sku}</Text>
                    <View
                      style={[
                        styles.productStatus,
                        product.ativo
                          ? styles.statusAvailable
                          : styles.statusUnavailable,
                      ]}
                    >
                      <Text>
                        {product.ativo ? "✓ Disponível" : "○ Indisponível"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            www.crcfarois.ind.br | contato@crcfarois.ind.br | (11) 99226-8645
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default CatalogPDF;
