/**
 * Created by tianhuyang on 11/3/15.
 */

function printPDF(url){
    var popup = window.open(url)
    popup.onload = function(evt){
        this.print()
    }
}
