from django.core.management.base import BaseCommand, CommandError
from crm.exporting import AirtableExporter
from organizer.exporting import get_exporter_class, collect_exporters
from tqdm import tqdm
import logging

log = logging.getLogger(__name__)

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('destination', nargs='+')
        parser.add_argument('--debug', default=False, action='store_true')
        parser.add_argument('--dry-run', default=False, action='store_true')

    def handle(self, *args, **options):
        if options['debug']:
            logging.basicConfig(level=logging.DEBUG)

        dryRun = options['dry_run']

        exporters = []
        for dest in options['destination']:
            exporterCls = get_exporter_class(dest)
            if exporterCls is None:
                print "No such exporter:", dest
                print "Available exporters:", ', '.join(collect_exporters().keys())
                return
            exporters.append((dest, exporterCls()))

        with tqdm(exporters, desc='destinations', unit=' destination') as expIt:
            for (exporterName, exporter) in expIt:
                exportedResource = exporter.Meta.resource()
                with tqdm(exporter, desc=exporterName, unit=' page') as it:
                    log.debug('Exporting %s items', len(exporter))
                    for page in it:
                        exporter.export_page(page, dry_run=dryRun)
