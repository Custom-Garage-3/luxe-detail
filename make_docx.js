const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  HeadingLevel, UnderlineType
} = require('docx');
const fs = require('fs');

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function label(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Yu Gothic", size: 21, color: "555555" })]
  });
}

function lineRow(label, width1 = 2000, width2 = 7026) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: width1, type: WidthType.DXA },
        verticalAlign: VerticalAlign.BOTTOM,
        margins: { top: 0, bottom: 0, left: 0, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: label, font: "Yu Gothic", size: 22, bold: true })]
        })]
      }),
      new TableCell({
        borders: { top: noBorder, left: noBorder, right: noBorder, bottom: thinBorder },
        width: { size: width2, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 120, right: 0 },
        children: [new Paragraph({ children: [new TextRun({ text: "　", size: 22 })] })]
      })
    ]
  });
}

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1200, right: 1134, bottom: 1200, left: 1134 }
      }
    },
    children: [

      // ロゴ
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "LUXERE", font: "Palatino Linotype", size: 36, bold: false, color: "8B7355" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "出張洗車サービス", font: "Yu Gothic", size: 18, color: "888888" })]
      }),

      // タイトル
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "8B7355", space: 4 }
        },
        children: [new TextRun({ text: "施 工 同 意 書", font: "Yu Gothic", size: 40, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 480 },
        children: [new TextRun({ text: "Consent Form for Car Detailing Service", font: "Palatino Linotype", size: 18, color: "999999" })]
      }),

      // 冒頭文
      new Paragraph({
        spacing: { before: 0, after: 320 },
        children: [new TextRun({
          text: "本同意書は、LUXEREが提供する出張洗車・詳細クリーニングサービスをご利用いただくにあたり、お客様にご確認・ご同意いただく内容を記載したものです。ご署名の前に必ずお読みください。",
          font: "Yu Gothic", size: 21, color: "333333"
        })]
      }),

      // セクション1
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: "8B7355", space: 8 } },
        indent: { left: 240 },
        children: [new TextRun({ text: "第１条　経年劣化・既存の塗装状態について", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({
        spacing: { before: 60, after: 160 },
        children: [new TextRun({
          text: "経年劣化による塗装の剥がれ・クリア層の浮き・チョーキング（白化）・クラック（ひび割れ）など、施工前から存在する塗装状態の悪化については、当社の施工に起因するものではないため、一切の責任を負いません。",
          font: "Yu Gothic", size: 21, color: "333333"
        })]
      }),

      // セクション2
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: "8B7355", space: 8 } },
        indent: { left: 240 },
        children: [new TextRun({ text: "第２条　汚れ下の傷・劣化の顕在化について", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({
        spacing: { before: 60, after: 160 },
        children: [new TextRun({
          text: "洗車・クリーニング前に汚れ・泥・水垢・コーティング剤等で覆われていた傷・凹み・塗装劣化・サビ等が、施工後に視認できるようになる場合があります。これは当社の施工によって新たに発生したものではなく、施工前から存在していたものが顕在化したものです。この場合、当社は責任を負いません。",
          font: "Yu Gothic", size: 21, color: "333333"
        })]
      }),

      // セクション3
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: "8B7355", space: 8 } },
        indent: { left: 240 },
        children: [new TextRun({ text: "第３条　その他の免責事項", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: "以下の事由による損害・損失については、当社は責任を負いかねます。", font: "Yu Gothic", size: 21, color: "333333" })]
      }),
      ...([
        "① 施工中・施工後に発生した天候（急雨・強風・砂埃等）による汚染",
        "② お客様の駐車スペースや周辺環境に起因する損傷（段差・障害物・他車との接触等）",
        "③ 施工前から存在していたウィンドウの飛び石傷・ひび、ゴム部品の劣化等",
        "④ 車両の電装系・電動部品（電動ミラー、電動窓等）の施工前からの不具合",
        "⑤ お客様の指示・要望に基づく施工による結果",
        "⑥ 荒天等やむを得ない事由による施工品質への影響"
      ].map(item => new Paragraph({
        spacing: { before: 40, after: 40 },
        indent: { left: 360 },
        children: [new TextRun({ text: item, font: "Yu Gothic", size: 21, color: "333333" })]
      }))),

      // セクション4
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: "8B7355", space: 8 } },
        indent: { left: 240 },
        children: [new TextRun({ text: "第４条　施工前確認", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({
        spacing: { before: 60, after: 300 },
        children: [new TextRun({
          text: "施工担当者は施工前にお客様立会いのもと車両状態を確認いたします。既存の傷・凹み・塗装不良等が確認された場合はお知らせします。お客様はその状態を確認のうえ施工にご同意いただきます。",
          font: "Yu Gothic", size: 21, color: "333333"
        })]
      }),

      // 同意チェック欄
      new Paragraph({
        spacing: { before: 200, after: 120 },
        children: [new TextRun({ text: "■ 同意確認", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Table({
        width: { size: 9638, type: WidthType.DXA },
        columnWidths: [9638],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 9638, type: WidthType.DXA },
                shading: { fill: "FAF8F5", type: ShadingType.CLEAR },
                margins: { top: 160, bottom: 160, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    spacing: { before: 40, after: 80 },
                    children: [new TextRun({ text: "□　上記の内容をすべて確認し、同意したうえで施工をお願いします。", font: "Yu Gothic", size: 22, bold: true })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "□　施工前の車両状態（傷・凹み等）を担当者と確認しました。", font: "Yu Gothic", size: 22, bold: true })]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // 記入欄
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "■ お客様情報", font: "Yu Gothic", size: 24, bold: true, color: "1A1A1A" })]
      }),
      new Table({
        width: { size: 9638, type: WidthType.DXA },
        columnWidths: [9638],
        rows: [
          new TableRow({
            children: [new TableCell({
              borders,
              width: { size: 9638, type: WidthType.DXA },
              margins: { top: 120, bottom: 120, left: 160, right: 160 },
              children: [
                new Table({
                  width: { size: 9286, type: WidthType.DXA },
                  columnWidths: [2000, 7026],
                  rows: [
                    lineRow("お名前"),
                    lineRow("お電話番号"),
                    lineRow("車　種"),
                    lineRow("ナンバー"),
                    lineRow("施工コース"),
                    lineRow("施工日"),
                    lineRow("ご署名", 2000, 5000),
                  ]
                })
              ]
            })]
          })
        ]
      }),

      // フッター的な連絡先
      new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 6 } },
        spacing: { before: 160, after: 60 },
        children: [new TextRun({ text: "LUXERE　出張洗車サービス", font: "Yu Gothic", size: 19, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "お問い合わせ・ご予約 / LINE : https://line.me/ti/p/Df93XFlxUP", font: "Yu Gothic", size: 19, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "Instagram : @luxere.tokai　／　対応エリア：愛知県・岐阜県", font: "Yu Gothic", size: 19, color: "888888" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("C:\\Users\\shang\\OneDrive\\Desktop\\出張洗車\\LUXERE_誓約書.docx", buf);
  console.log("Done!");
});
