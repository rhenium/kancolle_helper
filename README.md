# なにこれ
艦これの通信をキャプチャして艦隊の疲労度・HP 等を表示してくれる Google Chrome/Chromium Extension

もしあなたが Windows ユーザーなら [提督業も忙しい！(KanColleViewer)](https://github.com/Grabacr07/KanColleViewer) を使ったほうが幸せになれるとおもいます。

# いれかた
1. `git clone https://github.com/rhenium/kancolle_helper`
2. Chromium の Extensions (chrome://extensions/) を開く
3. 右上の Developer mode にチェックを入れる
4. Load unpacked extension... からさきほど clone したディレクトリを開く

# つかいかた
1. 新しくタブを開く
2. どうにかして Chromium の Developer Tools をひらく。Chromium のバージョンによっては Network タブのリクエスト記録が最初からオンになってるので外したほうがいいです（重くなるので）
3. 艦これのページを開く
4. 母港画面・入渠画面・補給とかをすると更新されます。

# ちゅうい
データを表示する部分が足りなかったため作戦要綱とかの説明類のボタンを隠してしまっています。表示したかったら自分で content\_script.css 書き換えてください。

KanColle Helper には中大破表示機能がありますがあまり信用しないでください。HP 小数点とか知りませんし轟沈しても責任は取れません。

通信をキャプチャしますが、Extension から API リクエストを発行したり通信内容の改ざん等は一切行っておらず、規約には違反しないと考えています。

Arch Linux x86\_64 上で自分でビルドした Chromium 33.0.1750.5 (241733) でしか動作確認をしておりません。他の環境では動かない可能性もあります。

:w
# たすけて
Chromium Extension からレスポンスボディをキャプチャする方法が chrome.devtools.network 以外見つかりませんでした。Developer Tools 毎回開くの正直かったるいのでだれかいい API おしえてくださいプルリクエストください

