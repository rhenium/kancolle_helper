# なにこれ
艦これの下に艦隊の状態を表示する Google Chrome/Chromium Extension

![http://p.twipple.jp/SRJuA](http://p.twpl.jp/show/orig/SRJuA)

もしあなたが Windows ユーザーなら [提督業も忙しい！(KanColleViewer)](https://github.com/Grabacr07/KanColleViewer) を使ったほうが幸せになれるとおもいます。

# いれかた
1. `git clone https://github.com/rhenium/kancolle_helper` or [Download ZIP](https://github.com/rhenium/kancolle_helper/archive/master.zip)
2. Chromium の Extensions (chrome://extensions/) を開く
3. 右上の Developer mode にチェックを入れる
4. Load unpacked extension... からさきほどのディレクトリを開く

# つかいかた
1. 新しくタブを開く
2. メニュー等から Chromium の Developer Tools をひらく。Chromium のバージョンによっては Network タブのリクエスト記録が最初からオンになってるのでオフにしたほうがいいです（重くなるので）
3. 艦これのページを開く
4. 母港画面・入渠画面・補給などの操作をしたタイミングで更新されます。

# そのた
データを表示する部分が足りなかったため作戦要綱とかの説明類のボタンを隠してしまっています。表示したかったら自分で content\_script.css を書き換えてください。

KanColle Helper の中大破表示は参考程度です。艦これ内部の基準と違う可能性がありますので轟沈しても責任は取れません。

通信をキャプチャしますが、Extension から API リクエストを発行したり通信内容の改ざん等は一切行っておらず、規約には違反しないと考えています。

Arch Linux x86\_64 上でビルドされた Chromium 34.0.1788.0 (245082) でのみ動作確認をしております。

:w
