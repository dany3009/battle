import signal
import time
import tornadio2 as tornadio
from tornado import web, ioloop, httpserver
from tornadio2 import SocketServer
from django.core.management.base import NoArgsCommand, BaseCommand, CommandError
from ships.tornadoapp import Connection


# class Command(NoArgsCommand):
#     def handle_noargs(self, **options):
#         router = tornadio.TornadioRouter(Connection)
#         app = web.Application(router.urls, socket_io_port=8001)
#         tornadio.SocketServer(app)


class Command(BaseCommand):
    args = '[port_number]'
    help = 'Starts the Tornadio2 server.'

    def sig_handler(self, sig, frame):
        ioloop.IOLoop.instance().add_callback(self.shutdown)

    def shutdown(self):
        self.http_server.stop()
        io_loop = ioloop.IOLoop.instance()
        # io_loop.add_timeout(time.time() + 1, io_loop.stop)
        io_loop.stop()

    def handle(self, *args, **options):
        if len(args) == 1:
            try:
                port = int(args[0])
            except ValueError:
                raise CommandError('Invalid port number specified')
        else:
            port = 8001

        router = tornadio.TornadioRouter(Connection)
        app = web.Application(router.urls, socket_io_port=port)

        self.http_server = httpserver.HTTPServer(app)
        self.http_server.listen(port, address="192.168.1.6")

        signal.signal(signal.SIGTERM, self.sig_handler)
        signal.signal(signal.SIGINT, self.sig_handler)

        print 'Server started on port {}'.format(port)
        ioloop.IOLoop.instance().start()