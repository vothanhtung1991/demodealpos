$(document).ready(function () {
    depRateUI.init();
});
var depRateUI = {
    txtUsefulLife: '',
    txtDepRate: '',
    ddlDepMethod:'',
    init: function () {
        this.txtUsefulLife = $('.usefullife');
        this.txtDepRate = $('.depRate');
        this.ddlDepMethod = $('#ddlDepMethod');
        this.txtUsefulLife.change(this.updateRate);
        this.txtUsefulLife.on('keyup', this.updateRate);
        this.ddlDepMethod.change(this.updateRate);
    },
    updateRate: function () {
        var rate = 0;
        if (depRateUI.txtUsefulLife.val() > 0 && depRateUI.ddlDepMethod.val() == 1) {
            rate = 100 / depRateUI.txtUsefulLife.val();
        }
        depRateUI.txtDepRate.val(rate);
    }
}
