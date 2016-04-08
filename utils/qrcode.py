__author__ = 'tianhuyang'
import io
import pyqrcode


class QrCode:
    @classmethod
    def create_svg_string(cls, content, svgclass='qrcode_svg', lineclass='qrcode_svg_path'):
        qr_code = pyqrcode.create(content)
        buffer = io.BytesIO()
        qr_code.svg(buffer, xmldecl=False, svgclass=svgclass, lineclass=lineclass)
        return buffer.getvalue()

    @classmethod
    def save_png(cls, content, buffer=None):
        qr_code = pyqrcode.create(content)
        if buffer is None:
            buffer = io.BytesIO()
        qr_code.png(buffer, scale=2, quiet_zone=0,  module_color=(255,255,255), background=(1,1,1,1))
        return buffer
